import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to environment variables");
}

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
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

export default clientPromise;
