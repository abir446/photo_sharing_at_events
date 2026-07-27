"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env.local in the workspace root
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env.local") });
// Import routers
const events_1 = __importDefault(require("./routes/events"));
const subscribe_1 = __importDefault(require("./routes/subscribe"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true
}));
// Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register routes
app.use("/api/events", events_1.default);
app.use("/api/subscribe", subscribe_1.default);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});
// Start the Express server
app.listen(PORT, () => {
    console.log(`Node.js backend running on port ${PORT}`);
});
