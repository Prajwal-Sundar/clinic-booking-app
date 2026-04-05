import type { DailyData } from "../../model/DailyData";
import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";
import { getDb } from "../db/mongo";

type DailySlotsDocument = {
  date: string;
  slotsByHour: DailyData;
};

type BookSlotSuccess = {
  ok: true;
  date: string;
  timeslot: string;
  slotIndex: number;
  updatedSlot: Slot;
};

type BookSlotFailureCode =
  | "DATE_NOT_FOUND"
  | "TIMESLOT_NOT_FOUND"
  | "NO_AVAILABLE_SLOT";

type BookSlotFailure = {
  ok: false;
  code: BookSlotFailureCode;
};

export type BookSlotResult = BookSlotSuccess | BookSlotFailure;

function normalizeTimeslot(value: string): string {
  return value.replace(/\s+/g, "").toLowerCase();
}

export async function bookSlot(
  date: string,
  timeslot: string,
  patient: Patient
): Promise<BookSlotResult> {
  const db = await getDb();
  const collection = db.collection<DailySlotsDocument>("dailySlots");

  const doc = await collection.findOne({ date });
  if (!doc) {
    return { ok: false, code: "DATE_NOT_FOUND" };
  }

  const targetKey = Object.keys(doc.slotsByHour).find(
    (key) => normalizeTimeslot(key) === normalizeTimeslot(timeslot)
  );

  if (!targetKey) {
    return { ok: false, code: "TIMESLOT_NOT_FOUND" };
  }

  const slots = doc.slotsByHour[targetKey] || [];
  const slotIndex = slots.findIndex((s) => s.available);

  if (slotIndex === -1) {
    return { ok: false, code: "NO_AVAILABLE_SLOT" };
  }

  const updatedSlot: Slot = {
    ...slots[slotIndex],
    available: false,
    patient,
  };

  const pathBase = `slotsByHour.${targetKey}.${slotIndex}`;

  const updateResult = await collection.updateOne(
    {
      date,
      [`${pathBase}.available`]: true,
    } as any,
    {
      $set: {
        [`${pathBase}.available`]: false,
        [`${pathBase}.patient`]: patient,
      },
    }
  );

  if (!updateResult.matchedCount) {
    // Another process may have booked in the meantime
    return { ok: false, code: "NO_AVAILABLE_SLOT" };
  }

  return {
    ok: true,
    date,
    timeslot: targetKey,
    slotIndex,
    updatedSlot,
  };
}

