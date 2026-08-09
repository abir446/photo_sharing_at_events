import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, preserve client across hot-reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const realClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 4000, // Timeout after 4 seconds
    });

    globalWithMongo._mongoClientPromise = realClient.connect()
      .then((client) => {
        console.log("🟢 Successfully connected to MongoDB Atlas!");
        return client;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Production connection
  const realClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
  });

  clientPromise = realClient.connect();
}

export default clientPromise;
