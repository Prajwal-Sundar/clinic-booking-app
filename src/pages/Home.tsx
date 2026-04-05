import React, { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
import SlotCard from "../components/SlotCard";
import PatientViewModal from "../components/PatientViewModal";
import BookingModal from "../components/BookingModal";

import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";
import type { DailyData } from "../../model/DailyData";

import { apiCaller, ApiEndpoint } from "../api";

/** YYYY-MM-DD in local timezone */
function todayIsoLocal(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Home: React.FC = () => {
  const [date, setDate] = useState<string>(todayIsoLocal);
  const [dailySlots, setDailySlots] = useState<DailyData>({});
  const [loading, setLoading] = useState(false);

  // View modal
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Booking modal
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  // Animation flags
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Fetch slots
  const fetchSlots = async (isoDate: string) => {
    setLoading(true);
    try {
      const [yyyy, mm, dd] = isoDate.split("-");
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      const response = await apiCaller<DailyData>(ApiEndpoint.GET_SLOTS, {
        date: formattedDate,
      });

      if (response.success && response.data) {
        setDailySlots(response.data);
      } else {
        setDailySlots({});
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      setDailySlots({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  // Close modal (shared)
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setBookingSlot(null);
      setIsClosing(false);
      setIsOpening(false);
    }, 300);
  };

  // Open patient view modal
  const handleOpenPatientView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsOpening(true);
  };

  // Open booking modal
  const handleBookClick = (hour: string) => {
    setBookingSlot(hour);
    setIsOpening(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen pt-6 pb-32">
      {/* Date Picker */}
      <DatePicker date={date} setDate={setDate} />

      {/* Loading */}
      {loading && <div className="text-gray-500 mb-4">Loading slots...</div>}

      {/* No Data */}
      {!loading && Object.keys(dailySlots).length === 0 && (
        <div className="text-center text-gray-600 mt-8 font-semibold">
          No Slots Available for this day
        </div>
      )}

      {/* Slots */}
      {Object.entries(dailySlots).map(([hour, slots]) => {
        const availableCount = slots.filter((s) => s.available).length;
        const isFull = availableCount === 0;

        return (
          <div key={hour} className="mb-8">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl text-gray-700">{hour}</h2>

              <button
                disabled={isFull}
                title={isFull ? "Slot Full" : "Book Slot"}
                onClick={() => handleBookClick(hour)}
                className={`px-4 py-2 rounded-lg font-semibold transition
                  ${
                    isFull
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
              >
                Book
              </button>
            </div>

            {/* Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {slots.map((slot: Slot, idx: number) => (
                <SlotCard
                  key={idx}
                  slot={slot}
                  index={idx}
                  onClick={handleOpenPatientView}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* View Modal */}
      {selectedPatient && !bookingSlot && (
        <PatientViewModal
          patient={selectedPatient}
          isClosing={isClosing}
          isOpening={isOpening}
          handleClose={handleCloseModal}
        />
      )}

      {/* Booking Modal */}
      {bookingSlot && (
        <BookingModal
          timeslot={bookingSlot}
          date={date}
          handleClose={handleCloseModal}
          onSuccess={() => fetchSlots(date)}
        />
      )}
    </div>
  );
};

export default Home;
