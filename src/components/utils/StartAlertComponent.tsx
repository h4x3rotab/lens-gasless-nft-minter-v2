import { useState } from "react";

export default function StartAlertComponent() {
  const [isVisible, setIsVisible] = useState(true);

  const handleAlertClick = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div>
        <div
          className="fixed z-3 w-full top-0 left-0 bg-blue-100 border-t-4 border-blue-500 text-black p-6 animate-slideDown duration-500"
          role="alert"
        >
          {/* Close Button */}
          <span
            className="absolute top-2 right-2 cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-200"
            onClick={handleAlertClick}
          >
            <div className="mb-1">x</div>
          </span>
          <p className="font-bold">
            Your user operation has been sent to the blockchain! ⛓️
          </p>
        </div>
      </div>
    )
  );
}
