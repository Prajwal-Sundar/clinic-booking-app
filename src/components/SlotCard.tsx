import React from "react";
import type { Slot } from "../../model/Slot";
import type { Patient } from "../../model/Patient";

type SlotCardProps = {
  slot: Slot;
  index: number;
  onClick: (patient: Patient) => void;
};

const SlotCard: React.FC<SlotCardProps> = ({ slot, index, onClick }) => {
  return (
    <div
      className={`p-4 border rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer
        ${slot.available ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}
      onClick={() => slot.patient && onClick(slot.patient)}
    >
      <h3 className="font-bold mb-1">Slot {index + 1}</h3>
      {slot.available ? (
        <p className="text-sm font-medium text-green-800">AVAILABLE</p>
      ) : (
        <>
          <p className="text-sm font-medium">{slot.patient?.name}</p>
          <p className="text-sm font-medium text-gray-800">
            {slot.patient?.age} Y | {slot.patient?.gender}
          </p>
        </>
      )}
    </div>
  );
};

export default SlotCard;
