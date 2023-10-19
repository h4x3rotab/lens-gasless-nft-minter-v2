import { useState } from "react";

export default function ErrorAlertComponent({ errorMessage }: any) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAlertClick = () => {
    setIsVisible(false);
  };

  console.log(errorMessage);

  return (
    isVisible && (
      <div role="alert" className="z-11 fixed w-full top-0 left-0">
        {/* Close Button */}
        <span
          className="absolute top-0 right-0 cursor-pointer px-4 py-2 text-white"
          onClick={handleAlertClick}
        >
          ×
        </span>
        <div className="bg-red-500 text-white font-bold px-4 py-4">Error</div>
        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>{errorMessage}</p>
        </div>
      </div>
    )
  );
}
