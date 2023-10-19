import { useState } from "react";

export default function SuccessAlertComponent({ message, hash }: any) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAlertClick = () => {
    setIsVisible(false);
  };

  return (
    isVisible && (
      <div>
        <div
          className="z-20 fixed w-full top-0 left-0 bg-teal-100 border-t-4 border-teal-500 rounded-b text-black p-4 shadow-md"
          role="alert"
        >
          {/* Close Button */}
          <span
            className="absolute top-0 right-0 cursor-pointer px-4 py-2"
            onClick={handleAlertClick}
          >
            ×
          </span>
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <span>
              {message}{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check out your transaction on Etherscan
              </a>
              .
            </span>
          </div>
        </div>
      </div>
    )
  );
}
