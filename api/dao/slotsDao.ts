import type { DailyData } from "../../model/DailyData";
import { getDb } from "../db/mongo";

type DailySlotsDocument = {
  date: string;
  slotsByHour: DailyData;
};

export async function getSlotsForDate(date: string): Promise<DailyData | null> {
  const db = await getDb();
  const collection = db.collection<DailySlotsDocument>("dailySlots");

  const existing = await collection.findOne({ date });
  return existing?.slotsByHour ?? null;
}

