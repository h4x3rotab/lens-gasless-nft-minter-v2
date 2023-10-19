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
          className="z-5 fixed w-full top-0 left-0 bg-yellow-100 border-t-4 border-b border-yellow-500 text-black p-4"
          role="alert"
        >
          {/* Close Button */}
          <span
            className="absolute top-0 right-0 cursor-pointer px-4 py-2 text-black"
            onClick={handleAlertClick}
          >
            ×
          </span>
          <p className="font-bold">Your user operation is being mined! ⛏️</p>
          <div className="flex items-center">
            This may take a few seconds, depending on network activity. ⏱️&nbsp;
            <a
              href={`https://www.jiffyscan.xyz/userOpHash/${hash}?network=sepolia`}
              className="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check out your user op&apos;s progress here.
            </a>
            <span className="ml-2 loading loading-dots loading-md"></span>
          </div>
        </div>
      </div>
    )
  );
}
