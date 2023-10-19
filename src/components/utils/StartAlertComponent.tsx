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
          className="fixed z-3 w-full top-0 left-0 bg-blue-100 border-t-4 border-blue-500 text-black p-4 animate-slideDown duration-500"
          role="alert"
        >
          {/* Close Button */}
          <span
            className="absolute top-0 right-0 cursor-pointer px-4 py-2"
            onClick={handleAlertClick}
          >
            ×
          </span>
          <p className="font-bold">
            Your user operation has been sent to the blockchain! ⛓️
          </p>
          <div className="flex items-center">
            The blockchain network has seen your user operation request and is
            processing it now! 👀&nbsp;
          </div>
        </div>
      </div>
    )
  );
}
