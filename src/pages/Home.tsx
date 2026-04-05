import React, { useEffect, useState } from "react";
import DatePicker from "../components/DatePicker";
import SlotCard from "../components/SlotCard";
import PatientModal from "../components/PatientModal";
import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";
import type { DailyData } from "../../model/DailyData";
import { apiCaller, ApiEndpoint } from "../api";

/** YYYY-MM-DD in the user's local timezone (matches `<input type="date" />`). */
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
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

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
      console.error("Unexpected error fetching slots:", err);
      setDailySlots({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setIsClosing(false);
      setIsOpening(false);
    }, 300);
  };

  const handleOpenModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsOpening(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen pt-6 pb-32">
      <DatePicker date={date} setDate={setDate} />

      {loading && <div className="text-gray-500 mb-4">Loading slots...</div>}

      {!loading && Object.keys(dailySlots).length === 0 && (
        <div className="text-center text-gray-600 mt-8 font-semibold">
          No Slots Available for this day
        </div>
      )}

      {Object.entries(dailySlots).map(([hour, slots]) => (
        <div key={hour} className="mb-8">
          <h2 className="font-semibold text-xl mb-4 text-gray-700">{hour}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {slots.map((slot: Slot, idx: number) => (
              <SlotCard
                key={idx}
                slot={slot}
                index={idx}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          isClosing={isClosing}
          isOpening={isOpening}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;
