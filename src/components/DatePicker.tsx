import React from "react";

type DatePickerProps = {
  date: string;
  setDate: (date: string) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  return (
    <div className="mb-6 flex flex-col items-center">
      <span className="text-sm font-bold text-gray-700 mb-1">Date</span>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded-md p-2 text-center w-40"
      />
    </div>
  );
};

export default DatePicker;
