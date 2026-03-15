import type { Handler } from "@netlify/functions";

// Patients pool
const patientsPool = [
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

// Slot hours
const slotHours = [
  "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM", "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM",
];

// Pre-defined booked slots count per hour per date
const bookedCounts: Record<string, Record<string, number>> = {
  "15-03-2026": { "12-1 PM": 3, "2-3 PM": 1, "5-6 PM": 2 },
  "16-03-2026": { "1-2 PM": 1, "4-5 PM": 1 },
  "17-03-2026": { "12-1 PM": 2, "2-3 PM": 1, "6-7 PM": 1 },
};

// Generate slots FCFS
function generateSlotsFCFS(date: string, hour: string) {
  const slots: any[] = [];
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

    // Build slots for all hours FCFS
    const slotsForDate: Record<string, any[]> = {};
    slotHours.forEach(hour => {
      slotsForDate[hour] = generateSlotsFCFS(date, hour);
    });

    // If the date is not in our bookedCounts map, return empty slots (all free)
    const isKnownDate = Object.keys(bookedCounts).includes(date);
    const response = isKnownDate ? slotsForDate : {};

    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message || "Internal Server Error" }) };
  }
};