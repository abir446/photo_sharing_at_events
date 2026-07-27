"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const qrcode_1 = __importDefault(require("qrcode"));
const cloudinary_1 = require("cloudinary");
const db_1 = __importDefault(require("../db"));
const sse_1 = require("../services/sse");
// Configure Multer for in-memory file uploads
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit matching client expectation
    },
});
// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
const router = (0, express_1.Router)();
// 1. GET /api/events - List events for a specific user
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string") {
            return res.status(400).json({ error: "userId is required as a query parameter" });
        }
        const client = await db_1.default;
        const db = client.db("dropcast");
        const events = await db
            .collection("events")
            .find({ userId })
            .sort({ _id: -1 })
            .toArray();
        return res.json(events);
    }
    catch (err) {
        console.error("Failed to fetch events from database:", err);
        return res.status(500).json({ error: "Database query failed: " + err.message });
    }
});
// 2. GET /api/events/:id - Fetch a single event's details
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid event ID format" });
        }
        const client = await db_1.default;
        const db = client.db("dropcast");
        const event = await db
            .collection("events")
            .findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        return res.json(event);
    }
    catch (err) {
        console.error("Failed to fetch event details:", err);
        return res.status(500).json({ error: "Database query failed: " + err.message });
    }
});
// 3. POST /api/events - Create a new event, generate QR code, upload to Cloudinary
router.post("/", async (req, res) => {
    try {
        const { eventName, eventDate, userId, userEmail } = req.body;
        if (!eventName || !eventDate || !userId || !userEmail) {
            return res.status(400).json({ error: "eventName, eventDate, userId, and userEmail are required" });
        }
        const client = await db_1.default;
        const db = client.db("dropcast");
        // Insert event to get unique ID
        const result = await db.collection("events").insertOne({
            userId,
            name: eventName,
            date: new Date(eventDate),
            createdAt: new Date(),
            createdBy: userEmail,
        });
        const eventId = result.insertedId.toString();
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const uploadUrl = `${baseUrl}/event/${eventId}/upload`;
        try {
            // Generate QR code as Base64 data URL
            const qrCodeDataUrl = await qrcode_1.default.toDataURL(uploadUrl, {
                errorCorrectionLevel: "H",
                margin: 2,
                width: 600,
            });
            // Upload QR code to Cloudinary
            const uploadResponse = await cloudinary_1.v2.uploader.upload(qrCodeDataUrl, {
                folder: "dropcast_qrcodes",
                public_id: `qr_${eventId}`,
                overwrite: true,
            });
            // Update event with QR code and upload url
            await db.collection("events").updateOne({ _id: result.insertedId }, {
                $set: {
                    qrCodeUrl: uploadResponse.secure_url,
                    uploadUrl,
                },
            });
            return res.json({ success: true, eventId });
        }
        catch (qrError) {
            console.error("Failed to generate or upload QR code:", qrError);
            return res.status(500).json({ success: false, error: "Failed to generate or upload QR code: " + qrError.message });
        }
    }
    catch (err) {
        console.error("Failed to create event:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});
// 4. GET /api/events/:id/media - Fetch all media items uploaded for an event
router.get("/:id/media", async (req, res) => {
    try {
        const { id } = req.params;
        const client = await db_1.default;
        const db = client.db("dropcast");
        const mediaDocs = await db
            .collection("media")
            .find({ eventId: id })
            .sort({ createdAt: -1 })
            .toArray();
        const mediaList = mediaDocs.map((doc) => ({
            _id: doc._id.toString(),
            eventId: doc.eventId,
            url: doc.url,
            publicId: doc.publicId,
            resourceType: doc.resourceType,
            createdAt: doc.createdAt.toISOString(),
        }));
        return res.json(mediaList);
    }
    catch (err) {
        console.error("Failed to fetch event media:", err);
        return res.status(500).json({ error: "Database query failed: " + err.message });
    }
});
// 5. POST /api/events/:id/media - Upload image/video to Cloudinary, save metadata to DB, emit SSE
router.post("/:id/media", upload.single("file"), async (req, res) => {
    try {
        const eventId = req.params.id;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        // Pipe the buffer to Cloudinary
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `dropcast_events/${eventId}`,
            resource_type: "auto",
        }, async (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).json({ error: "Cloudinary upload failed: " + error.message });
            }
            if (!result) {
                return res.status(500).json({ error: "Cloudinary upload returned empty result" });
            }
            try {
                const client = await db_1.default;
                const db = client.db("dropcast");
                const mediaItem = {
                    eventId,
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                    createdAt: new Date(),
                };
                const insertResult = await db.collection("media").insertOne(mediaItem);
                const completeItem = {
                    ...mediaItem,
                    _id: insertResult.insertedId.toString(),
                    createdAt: mediaItem.createdAt.toISOString(),
                };
                // Emit the upload event to active SSE clients
                sse_1.uploadEvents.emit("upload", { eventId, mediaItem: completeItem });
                return res.json(completeItem);
            }
            catch (dbError) {
                console.error("Database save error:", dbError);
                return res.status(500).json({ error: "Failed to save upload info to database: " + dbError.message });
            }
        });
        uploadStream.end(file.buffer);
    }
    catch (err) {
        console.error("Upload media router error:", err);
        return res.status(500).json({ error: err.message });
    }
});
// 6. GET /api/events/:id/sse - Server-Sent Events endpoint for real-time media feeds
router.get("/:id/sse", (req, res) => {
    const eventId = req.params.id;
    // Set SSE Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    // Keep-alive heartbeat interval to prevent gateway timeouts
    const keepAliveInterval = setInterval(() => {
        res.write(":keep-alive\n\n");
    }, 15000);
    // SSE listener callback
    const listener = (data) => {
        if (data.eventId === eventId) {
            res.write(`data: ${JSON.stringify(data.mediaItem)}\n\n`);
        }
    };
    // Register subscription
    sse_1.uploadEvents.on("upload", listener);
    // Clean up on client disconnect
    req.on("close", () => {
        clearInterval(keepAliveInterval);
        sse_1.uploadEvents.off("upload", listener);
        res.end();
    });
});
exports.default = router;
