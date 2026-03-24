import { getDb } from "../api/db/mongo";

async function main() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    console.log("✅ Connected to MongoDB. Database name:", db.databaseName);
    console.log("Existing collections:", collections.map((c) => c.name));
    const dailyCount = await db.collection("dailySlots").countDocuments();
    console.log("dailySlots document count:", dailyCount);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

void main();

