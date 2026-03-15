import React from "react";
import type { Patient } from "../../model/Patient";
import {
  CakeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

type ModalProps = {
  patient: Patient;
  isClosing: boolean;
  isOpening: boolean;
  handleClose: () => void;
};

const PatientModal: React.FC<ModalProps> = ({
  patient,
  isClosing,
  isOpening,
  handleClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-50"
        } bg-black`}
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
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
            {patient.name}
          </h2>
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-1 flex items-center gap-2">
                  <CakeIcon className="w-5 h-5 text-indigo-500" /> Age
                </td>
                <td className="px-2 py-1">{patient.age}</td>
              </tr>
              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-1 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-pink-500" /> Gender
                </td>
                <td className="px-2 py-1">{patient.gender}</td>
              </tr>
              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-1 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-green-500" /> City
                </td>
                <td className="px-2 py-1">{patient.city}</td>
              </tr>
              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-1 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-purple-500" /> Phone
                </td>
                <td className="px-2 py-1">{patient.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-b-2xl p-4 text-center">
          <button
            className="px-4 py-2 bg-white text-red-500 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>

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

export default PatientModal;
