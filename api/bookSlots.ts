/**
 * Netlify serverless handler for POST /api/bookSlots (writes via bookSlotDao).
 * From the app: apiCaller(ApiEndpoint.BOOK_SLOT, { date, timeslot, patient }).
 */
import type { Handler } from "@netlify/functions";
import type { Patient } from "../model/Patient";
import { bookSlot } from "./dao/bookSlotDao";

function makeResponse(statusCode: number, payload: any) {
  return {
    statusCode,
    body: JSON.stringify({
      status: statusCode,
      ...payload,
    }),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return makeResponse(405, {
      success: false,
      messageCode: "BOOK_SLOT_METHOD_NOT_ALLOWED",
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { date, timeslot, patient } = body as {
      date?: string;
      timeslot?: string;
      patient?: Patient;
    };

    if (!date || !timeslot || !patient) {
      return makeResponse(400, {
        success: false,
        messageCode: "BOOK_SLOT_BAD_REQUEST",
        message: "Missing required fields: date, timeslot, patient.",
      });
    }

    const result = await bookSlot(date, timeslot, patient);

    if (!result.ok) {
      switch (result.code) {
        case "DATE_NOT_FOUND":
          return makeResponse(404, {
            success: false,
            messageCode: "BOOK_SLOT_DATE_NOT_FOUND",
            message: "No slots found for the given date.",
          });
        case "TIMESLOT_NOT_FOUND":
          return makeResponse(404, {
            success: false,
            messageCode: "BOOK_SLOT_TIMESLOT_NOT_FOUND",
            message: "The requested timeslot does not exist for this date.",
          });
        case "NO_AVAILABLE_SLOT":
        default:
          return makeResponse(409, {
            success: false,
            messageCode: "BOOK_SLOT_NO_AVAILABLE_SLOT",
            message: "No available slots remaining for this timeslot.",
          });
      }
    }

    return makeResponse(200, {
      success: true,
      messageCode: "BOOK_SLOT_SUCCESS",
      message: "Slot booked successfully.",
      data: {
        date: result.date,
        timeslot: result.timeslot,
        slotIndex: result.slotIndex,
        slot: result.updatedSlot,
      },
    });
  } catch (err: any) {
    return makeResponse(500, {
      success: false,
      messageCode: "BOOK_SLOT_INTERNAL_ERROR",
      message: err?.message || "Internal Server Error while booking slot.",
    });
  }
};

