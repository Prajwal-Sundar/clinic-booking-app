import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 sticky top-0 z-50 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center select-none">
        <h1
          className="relative text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent inline-block
            after:block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 
            after:bg-gradient-to-r after:from-red-500 after:via-pink-500 after:to-purple-500
            after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
        >
          SMS Neuro Clinic Appointments
        </h1>
      </div>
    </header>
  );
};

export default Header;
