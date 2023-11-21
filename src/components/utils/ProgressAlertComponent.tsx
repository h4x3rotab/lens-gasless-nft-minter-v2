import { useState } from "react";

export default function ProgressAlertComponent({ hash }: any) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAlertClick = () => {
    setIsVisible(false);
  };
  return (
    isVisible && (
      <div>
        <div
          className="z-5 fixed w-full top-0 left-0 bg-yellow-100 border-t-4 border-b border-yellow-500 text-black p-6"
          role="alert"
        >
          {/* Close Button */}
          <span
            className="absolute top-2 right-2 cursor-pointer bg-yellow-200 hover:bg-yellow-300 text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-200"
            onClick={handleAlertClick}
          >
            <div className="mb-1">x</div>
          </span>
          <p className="font-bold">Your user operation is being mined! ⛏️</p>
        </div>
      </div>
    )
  );
}
