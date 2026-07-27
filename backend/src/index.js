import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local in the workspace root
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Import routers
import eventsRouter from "./routes/events.js";
import subscribeRouter from "./routes/subscribe.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/events", eventsRouter);
app.use("/api/subscribe", subscribeRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Node.js backend running on port ${PORT}`);
});
