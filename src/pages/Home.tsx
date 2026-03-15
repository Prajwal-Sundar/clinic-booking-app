import React, { useState } from "react";
import DatePicker from "../components/DatePicker";
import SlotCard from "../components/SlotCard";
import PatientModal from "../components/PatientModal";
import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";
import type { DailyData } from "../../model/DailyData";
import {
  patientsDay15,
  patientsDay16,
  patientsDay17,
} from "../data/mockPatients";

const timeSlots = [
  "12-1 PM",
  "1-2 PM",
  "2-3 PM",
  "4-5 PM",
  "5-6 PM",
  "6-7 PM",
  "7-8 PM",
];

const Home: React.FC = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const generateSlots = (
    bookedCount: number,
    patientList: Patient[],
  ): Slot[] => {
    const slots: Slot[] = [];
    for (let i = 0; i < 6; i++) {
      if (i < bookedCount)
        slots.push({ available: false, patient: patientList[i] });
      else slots.push({ available: true });
    }
    return slots;
  };

  const getDailySlots = (isoDate: string): DailyData => {
    const slots: DailyData = {};
    timeSlots.forEach((hour) => {
      if (isoDate === "2026-03-15") {
        if (hour === "12-1 PM") slots[hour] = generateSlots(3, patientsDay15);
        else if (hour === "2-3 PM")
          slots[hour] = generateSlots(1, [patientsDay15[3]]);
        else if (hour === "5-6 PM")
          slots[hour] = generateSlots(2, [patientsDay15[0], patientsDay15[2]]);
        else slots[hour] = generateSlots(0, []);
      } else if (isoDate === "2026-03-16") {
        if (hour === "1-2 PM") slots[hour] = generateSlots(1, patientsDay16);
        else if (hour === "4-5 PM")
          slots[hour] = generateSlots(1, [patientsDay16[1]]);
        else slots[hour] = generateSlots(0, []);
      } else if (isoDate === "2026-03-17") {
        if (hour === "12-1 PM")
          slots[hour] = generateSlots(2, [patientsDay17[0], patientsDay17[1]]);
        else if (hour === "2-3 PM")
          slots[hour] = generateSlots(1, [patientsDay17[2]]);
        else if (hour === "6-7 PM")
          slots[hour] = generateSlots(1, [patientsDay17[1]]);
        else slots[hour] = generateSlots(0, []);
      } else {
        slots[hour] = generateSlots(0, []);
      }
    });
    return slots;
  };

  const dailySlots = getDailySlots(date);

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

      {Object.entries(dailySlots).map(([hour, slots]) => (
        <div key={hour} className="mb-8">
          <h2 className="font-semibold text-xl mb-4 text-gray-700">{hour}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {slots.map((slot, idx) => (
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
