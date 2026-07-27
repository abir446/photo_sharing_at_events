"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// @ts-ignore
const mailchimp_marketing_1 = __importDefault(require("@mailchimp/mailchimp_marketing"));
mailchimp_marketing_1.default.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY || "",
    server: process.env.MAILCHIMP_SERVER || "",
});
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }
        const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
        if (!audienceId) {
            console.error("Missing MAILCHIMP_AUDIENCE_ID in environment variables.");
            return res.status(500).json({
                success: false,
                message: "Mailchimp is not configured correctly on the server.",
            });
        }
        await mailchimp_marketing_1.default.lists.addListMember(audienceId, {
            email_address: email.trim(),
            status: "subscribed",
        });
        return res.json({
            success: true,
        });
    }
    catch (err) {
        console.error("Mailchimp API Error:", err);
        const detail = err.response?.body?.detail || err.message || "Something went wrong.";
        return res.status(500).json({
            success: false,
            message: detail,
        });
    }
});
exports.default = router;
