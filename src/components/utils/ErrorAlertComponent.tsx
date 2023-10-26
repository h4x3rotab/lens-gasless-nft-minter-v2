import { useState } from "react";

export default function ErrorAlertComponent({ errorMessage }: any) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAlertClick = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div role="alert" className="z-11 fixed w-full top-0 left-0">
        {/* Close Button */}
        <span
          className="absolute top-1 right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200"
          onClick={handleAlertClick}
        >
          <div className="mb-1">x</div>
        </span>
        <div className="bg-red-500 text-white font-bold px-4 py-2">Error</div>
        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-black">
          <p>{errorMessage}</p>
        </div>
      </div>
    )
  );
}
