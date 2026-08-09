import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;

// Set up the local JSON DB path
const LOCAL_DB_PATH = path.join(process.cwd(), ".local_db.json");

// Read/write helpers for local fallback
function readLocalDb() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    return { events: [], media: [], subscribers: [] };
  }
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read local DB:", err);
    return { events: [], media: [], subscribers: [] };
  }
}

function writeLocalDb(data: any) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to local DB:", err);
  }
}

function matches(item: any, query: any) {
  if (!query) return true;
  for (const key in query) {
    const val = query[key];
    if (key === "_id") {
      const itemVal = item._id ? item._id.toString() : "";
      const queryVal = val ? val.toString() : "";
      if (itemVal !== queryVal) return false;
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

class MockCursor {
  private items: any[];

  constructor(items: any[]) {
    this.items = items;
  }

  sort(sortSpec: any) {
    const keys = Object.keys(sortSpec);
    if (keys.length > 0) {
      const key = keys[0];
      const dir = sortSpec[key]; // 1 or -1
      this.items.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        // Convert dates/iso strings to timestamps for comparison
        if (valA instanceof Date) valA = valA.getTime();
        if (valB instanceof Date) valB = valB.getTime();
        if (typeof valA === "string" && !isNaN(Date.parse(valA))) valA = new Date(valA).getTime();
        if (typeof valB === "string" && !isNaN(Date.parse(valB))) valB = new Date(valB).getTime();

        if (valA < valB) return dir === -1 ? 1 : -1;
        if (valA > valB) return dir === -1 ? -1 : 1;
        return 0;
      });
    }
    return this;
  }

  async toArray() {
    return this.items.map(item => {
      // Re-hydrate date objects when pulling from JSON
      if (item.date && typeof item.date === "string") {
        item.date = new Date(item.date);
      }
      if (item.createdAt && typeof item.createdAt === "string") {
        item.createdAt = new Date(item.createdAt);
      }
      return item;
    });
  }
}

class MockCollection {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async find(query: any) {
    const dbData = readLocalDb();
    const collectionData = dbData[this.name] || [];
    const filtered = collectionData.filter((item: any) => matches(item, query));
    return new MockCursor(filtered);
  }

  async findOne(query: any) {
    const dbData = readLocalDb();
    const collectionData = dbData[this.name] || [];
    const item = collectionData.find((item: any) => matches(item, query));
    if (item) {
      // Re-hydrate date objects when pulling from JSON
      if (item.date && typeof item.date === "string") {
        item.date = new Date(item.date);
      }
      if (item.createdAt && typeof item.createdAt === "string") {
        item.createdAt = new Date(item.createdAt);
      }
      return item;
    }
    return null;
  }

  async insertOne(doc: any) {
    const dbData = readLocalDb();
    if (!dbData[this.name]) {
      dbData[this.name] = [];
    }
    const insertedId = new ObjectId();
    const newDoc = {
      ...doc,
      _id: insertedId.toString(),
      createdAt: doc.createdAt || new Date().toISOString(),
    };
    dbData[this.name].push(newDoc);
    writeLocalDb(dbData);
    return { insertedId };
  }

  async updateOne(query: any, update: any) {
    const dbData = readLocalDb();
    const collectionData = dbData[this.name] || [];
    const item = collectionData.find((item: any) => matches(item, query));
    if (item && update.$set) {
      Object.assign(item, update.$set);
      writeLocalDb(dbData);
    }
    return { modifiedCount: item ? 1 : 0 };
  }

  async deleteOne(query: any) {
    const dbData = readLocalDb();
    const collectionData = dbData[this.name] || [];
    const index = collectionData.findIndex((item: any) => matches(item, query));
    if (index !== -1) {
      collectionData.splice(index, 1);
      dbData[this.name] = collectionData;
      writeLocalDb(dbData);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
}

class MockDb {
  dbName: string;
  constructor(dbName: string) {
    this.dbName = dbName;
  }
  collection(name: string) {
    return new MockCollection(name);
  }
}

class MockMongoClient {
  db(name: string) {
    return new MockDb(name);
  }
  async connect() {
    return this;
  }
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, preserve client across hot-reloads
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    // Attempt real connection with a short timeout
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
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB Connection Failed. Falling back to local file database (.local_db.json):", err.message);
        return new MockMongoClient() as unknown as MongoClient;
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

  clientPromise = realClient.connect().catch((err) => {
    console.warn("⚠️ Production MongoDB Connection Failed, using mock DB:", err.message);
    return new MockMongoClient() as unknown as MongoClient;
  });
}

export default clientPromise;