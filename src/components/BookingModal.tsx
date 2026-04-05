import React, { useState } from "react";
import type { Patient } from "../../model/Patient";
import {
  CakeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { apiCaller, ApiEndpoint } from "../api";

type Props = {
  timeslot: string;
  date: string;
  handleClose: () => void;
  onSuccess: () => void;
};

const BookingModal: React.FC<Props> = ({
  timeslot,
  date,
  handleClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<Patient>({
    name: "",
    age: 0,
    gender: "",
    city: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleChange = (field: keyof Patient, value: any) => {
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    if (!form.name || !form.city || !form.gender) {
      return "Please fill all fields";
    }
    if (form.phone.length !== 10) return "Phone must be 10 digits";
    if (form.age <= 0) return "Invalid age";
    return "";
  };

  const handleBook = async () => {
    if (loading || isLocked) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [yyyy, mm, dd] = date.split("-");
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      const res = await apiCaller(ApiEndpoint.BOOK_SLOT, {
        date: formattedDate,
        timeslot,
        patient: form,
      });

      if (res.success) {
        setMessage("Booking successful!");
        onSuccess();
      } else {
        setMessage(res.message || "Booking failed");
      }

      setIsLocked(true); // 🔒 lock after response
    } catch {
      setMessage("Something went wrong");
      setIsLocked(true);
    } finally {
      setLoading(false);

      setTimeout(() => {
        handleClose();
      }, 3000); // ⏱ 3 seconds
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative w-11/12 sm:w-96 rounded-2xl shadow-2xl transform transition-all duration-300 animate-fade-in">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-t-2xl p-4 text-center text-white font-bold text-xl relative">
          Book Slot ({timeslot})
          <button
            className="absolute top-2 right-3 text-white hover:text-gray-200 font-bold text-xl"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>

        {/* BODY */}
        <div className="bg-white p-6">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-2 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-indigo-500" /> Name
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </td>
              </tr>

              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-2 flex items-center gap-2">
                  <CakeIcon className="w-5 h-5 text-pink-500" /> Age
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={form.age || ""}
                    onChange={(e) =>
                      handleChange("age", Number(e.target.value))
                    }
                  />
                </td>
              </tr>

              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-2 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-500" /> Gender
                </td>
                <td className="px-2 py-2">
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </td>
              </tr>

              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-2 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-green-500" /> City
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </td>
              </tr>

              <tr className="odd:bg-indigo-50 even:bg-white">
                <td className="px-2 py-2 flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-indigo-500" /> Phone
                </td>
                <td className="px-2 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {error && (
            <div className="text-red-500 text-sm mt-3 text-center">{error}</div>
          )}

          {message && (
            <div className="text-center font-semibold mt-3 text-gray-700">
              {message}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-b-2xl p-4 text-center">
          <button
            onClick={handleBook}
            disabled={loading || isLocked}
            className="px-4 py-2 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition mr-2 disabled:opacity-50"
          >
            {loading ? "Booking..." : isLocked ? "Please wait..." : "Confirm"}
          </button>

          <button
            className="px-4 py-2 bg-white text-red-500 font-bold rounded-lg hover:bg-gray-100 transition"
            onClick={handleClose}
          >
            Cancel
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

export default BookingModal;
