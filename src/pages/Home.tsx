import React, { useState } from "react";
import {
  CakeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

type PatientInfo = {
  name: string;
  age: number;
  gender: string;
  city: string;
  phone: string;
};

type Slot = {
  available: boolean;
  patient?: PatientInfo;
};

type DailyData = Record<string, Slot[]>;

const Home: React.FC = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const generateSlots = (
    bookedCount: number,
    patientList: PatientInfo[],
  ): Slot[] => {
    const slots: Slot[] = [];
    for (let i = 0; i < 6; i++) {
      if (i < bookedCount)
        slots.push({ available: false, patient: patientList[i] });
      else slots.push({ available: true });
    }
    return slots;
  };

  // --- Mock Patients for 3 days (Tamil & Kannada Hindu Names) ---
  const patientsDay15: PatientInfo[] = [
    {
      name: "Arun Kumar",
      age: 28,
      gender: "M",
      city: "Chennai",
      phone: "+919876543210",
    },
    {
      name: "Meena Reddy",
      age: 32,
      gender: "F",
      city: "Bengaluru",
      phone: "+919123456780",
    },
    {
      name: "Karthik Sharma",
      age: 25,
      gender: "M",
      city: "Coimbatore",
      phone: "+919988776655",
    },
    {
      name: "Lakshmi Devi",
      age: 30,
      gender: "F",
      city: "Mysuru",
      phone: "+919011223344",
    },
  ];

  const patientsDay16: PatientInfo[] = [
    {
      name: "Raghavendra",
      age: 40,
      gender: "M",
      city: "Bengaluru",
      phone: "+919012345678",
    },
    {
      name: "Anitha",
      age: 29,
      gender: "F",
      city: "Chennai",
      phone: "+919876543219",
    },
  ];

  const patientsDay17: PatientInfo[] = [
    {
      name: "Venkatesh",
      age: 35,
      gender: "M",
      city: "Mysuru",
      phone: "+919887766554",
    },
    {
      name: "Divya",
      age: 27,
      gender: "F",
      city: "Coimbatore",
      phone: "+919912345678",
    },
    {
      name: "Sundar",
      age: 31,
      gender: "M",
      city: "Chennai",
      phone: "+919900112233",
    },
  ];

  const timeSlots = [
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "4-5 PM",
    "5-6 PM",
    "6-7 PM",
    "7-8 PM",
  ];

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

  const handleOpenModal = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setIsOpening(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen pt-6 pb-32">
      {/* Date Picker */}
      <div className="mb-6 flex flex-col items-center">
        <span className="text-sm font-bold text-gray-700 mb-1">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md p-2 text-center w-40"
        />
      </div>

      {/* Slots */}
      {Object.entries(dailySlots).map(([hour, slots]) => (
        <div key={hour} className="mb-8">
          <h2 className="font-semibold text-xl mb-4 text-gray-700">{hour}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {slots.map((slot, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer
                  ${slot.available ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}
                onClick={() => slot.patient && handleOpenModal(slot.patient)}
              >
                <h3 className="font-bold mb-1">Slot {idx + 1}</h3>
                {slot.available ? (
                  <p className="text-sm font-medium text-green-800">
                    AVAILABLE
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">{slot.patient?.name}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {slot.patient?.age} Y | {slot.patient?.gender}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-50"} bg-black`}
          />
          <div
            className={`relative w-11/12 sm:w-96 rounded-2xl shadow-2xl transform transition-all duration-300
              ${isOpening && !isClosing ? "opacity-100 scale-100" : ""}
              ${isClosing ? "opacity-0 scale-95" : "animate-fade-in"}`}
          >
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-t-2xl p-4 text-center text-white font-bold text-xl relative">
              Patient Details
              <button
                className="absolute top-2 right-3 text-white hover:text-gray-200 font-bold text-xl transition-colors"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="bg-white p-6">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
                {selectedPatient.name}
              </h2>
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="odd:bg-indigo-50 even:bg-white">
                    <td className="px-2 py-1 flex items-center gap-2">
                      <CakeIcon className="w-5 h-5 text-indigo-500" /> Age
                    </td>
                    <td className="px-2 py-1">{selectedPatient.age}</td>
                  </tr>
                  <tr className="odd:bg-indigo-50 even:bg-white">
                    <td className="px-2 py-1 flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-pink-500" /> Gender
                    </td>
                    <td className="px-2 py-1">{selectedPatient.gender}</td>
                  </tr>
                  <tr className="odd:bg-indigo-50 even:bg-white">
                    <td className="px-2 py-1 flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5 text-green-500" /> City
                    </td>
                    <td className="px-2 py-1">{selectedPatient.city}</td>
                  </tr>
                  <tr className="odd:bg-indigo-50 even:bg-white">
                    <td className="px-2 py-1 flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-purple-500" /> Phone
                    </td>
                    <td className="px-2 py-1">{selectedPatient.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-b-2xl p-4 text-center">
              <button
                className="px-4 py-2 bg-white text-red-500 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
