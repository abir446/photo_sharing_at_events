"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to environment variables");
}
const uri = process.env.MONGODB_URI;
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const clientPromise = client.connect()
    .then((connectedClient) => {
    console.log("MongoDB connection established.");
    return connectedClient;
})
    .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
});
exports.default = clientPromise;
