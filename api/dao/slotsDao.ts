import type { DailyData } from "../../model/DailyData";
import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";
import { getDb } from "../db/mongo";

const patientsPool: Patient[] = [
  { name: "Arun Kumar", age: 28, gender: "M", city: "Chennai", phone: "+919876543210" },
  { name: "Meena Reddy", age: 32, gender: "F", city: "Bengaluru", phone: "+919123456780" },
  { name: "Karthik Sharma", age: 25, gender: "M", city: "Coimbatore", phone: "+919988776655" },
  { name: "Lakshmi Devi", age: 30, gender: "F", city: "Mysuru", phone: "+919011223344" },
  { name: "Raghavendra", age: 40, gender: "M", city: "Bengaluru", phone: "+919012345678" },
  { name: "Anitha", age: 29, gender: "F", city: "Chennai", phone: "+919876543219" },
  { name: "Venkatesh", age: 35, gender: "M", city: "Mysuru", phone: "+919887766554" },
  { name: "Divya", age: 27, gender: "F", city: "Coimbatore", phone: "+919912345678" },
  { name: "Sundar", age: 31, gender: "M", city: "Chennai", phone: "+919900112233" },
];

export const slotHours = [
  "12-1 PM",
  "1-2 PM",
  "2-3 PM",
  "3-4 PM",
  "4-5 PM",
  "5-6 PM",
  "6-7 PM",
  "7-8 PM",
  "8-9 PM",
] as const;

const bookedCounts: Record<string, Record<string, number>> = {
  "15-03-2026": { "12-1 PM": 3, "2-3 PM": 1, "5-6 PM": 2 },
  "16-03-2026": { "1-2 PM": 1, "4-5 PM": 1 },
  "17-03-2026": { "12-1 PM": 2, "2-3 PM": 1, "6-7 PM": 1 },
};

function generateSlotsFCFS(date: string, hour: string): Slot[] {
  const slots: Slot[] = [];
  const bookedCount = bookedCounts[date]?.[hour] || 0;

  for (let i = 0; i < 6; i++) {
    if (i < bookedCount) {
      const patient = patientsPool[i % patientsPool.length];
      slots.push({ available: false, patient });
    } else {
      slots.push({ available: true });
    }
  }

  return slots;
}

type DailySlotsDocument = {
  date: string;
  slotsByHour: DailyData;
};

export async function getOrCreateSlotsForDate(date: string): Promise<DailyData> {
  const db = await getDb();
  const collection = db.collection<DailySlotsDocument>("dailySlots");

  const existing = await collection.findOne({ date });
  if (existing?.slotsByHour) {
    return existing.slotsByHour;
  }

  const slotsByHour: DailyData = {};

  slotHours.forEach((hour) => {
    slotsByHour[hour] = generateSlotsFCFS(date, hour);
  });

  const doc: DailySlotsDocument = {
    date,
    slotsByHour,
  };

  await collection.insertOne(doc);

  return slotsByHour;
}

