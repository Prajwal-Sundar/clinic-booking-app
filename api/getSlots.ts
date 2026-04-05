import type { Handler } from "@netlify/functions";
import { getSlotsForDate } from "./dao/slotsDao";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const date = body.date;

    if (!date) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: "Missing date in request body" }) };
    }

    const slotsForDate = await getSlotsForDate(date);

    // For unknown dates, return an empty object (no slots yet)
    return { statusCode: 200, body: JSON.stringify(slotsForDate ?? {}) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message || "Internal Server Error" }) };
  }
};