"use client";
import { useWalletContext } from "@/context/wallet";
import Image from "next/image";
import { AvatarGenerator } from "random-avatar-generator";
import { useCallback, useState } from "react";
import demoLogo from "../../public/assets/demo_logo.svg";

export default function Navbar() {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const generator = new AvatarGenerator();

  const { isLoggedIn, login, logout, username, scaAddress } =
    useWalletContext();

  const openModal = useCallback(() => {
    setIsLoggingIn(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsLoggingIn(false);
  }, []);

  const onEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setEmail(e.target.value);
    },
    []
  );

  const handleLogin = useCallback(async () => {
    await login(email);
    setIsLoggingIn(false);
    setEmail("");
    closeModal();
  }, [login, email]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  }, [logout]);

  function truncateEthAddress(
    address: string,
    prefixLength: number = 4,
    suffixLength: number = 4
  ): string {
    if (!address) {
      return "";
    }

    if (!address.startsWith("0x")) {
      throw new Error("Invalid Ethereum address");
    }
    if (address.length !== 42) {
      // 2 for '0x' and 40 for the address
      throw new Error("Invalid Ethereum address length");
    }

    const prefix = address.substr(0, 2 + prefixLength); // 2 for '0x'
    const suffix = address.substr(-suffixLength);

    return `${prefix}...${suffix}`;
  }

  return (
    <div className="navbar font-mono mt-2 flex justify-between items-center">
      <div className="flex-1 ml-3 md:ml-6">
        <div className="cursor-pointer flex items-center">
          <Image src={demoLogo} alt="logo" />
        </div>
      </div>

      {isLoggedIn ? (
        <div className="mr-6">
          <div className="md:mr-2.5">
            <a
              className="link link-primary hidden md:flex"
              href={`https://sepolia.etherscan.io/address/${scaAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateEthAddress(scaAddress as string)}
            </a>
          </div>
          <div className="dropdown dropdown-end">
            <img
              src={generator.generateRandomAvatar(email)}
              tabIndex={0}
              className="w-12 h-12 rounded-full align-middle cursor-pointer mr-2 mb-2"
            />
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 gap-2">
              <li>
                <a>{username}</a>
              </li>
              <li>
                <a
                  className="link link-primary block sm:hidden"
                  href={`https://sepolia.etherscan.io/address/${scaAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncateEthAddress(scaAddress as string)}
                </a>
              </li>

              <li>
                <button className="btn btn-error" onClick={handleLogout}>
                  <div className="mt-[7.5px] text-white">Logout</div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="btn btn-primary text-white md:mr-4" onClick={openModal}>
          Login
        </div>
      )}
      {/* login pop-up modal */}
      <dialog className={`modal ${isLoggingIn && "modal-open"}`}>
        <div className="modal-box flex flex-col gap-[12px]">
          <h3 className="font-bold text-lg">Enter your email!</h3>
          <input
            placeholder="email"
            onChange={onEmailChange}
            className="input border border-solid border-gray-400"
          />
          <div className="flex flex-row justify-end max-md:flex-col flex-wrap gap-[12px]">
            <button
              onClick={closeModal}
              className="btn bg-gradient-2transition ease-in-out duration-500 transform hover:scale-110"
            >
              Close
            </button>
            <button
              onClick={handleLogin}
              className="btn bg-gradient-1transition ease-in-out duration-500 transform hover:scale-110"
            >
              Login
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
