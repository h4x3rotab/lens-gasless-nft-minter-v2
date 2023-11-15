import {
  AccountKitNftMinterAbi,
  nftContractAddress,
} from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import { useInterval } from "@/hooks/useInterval";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Transaction, encodeFunctionData } from "viem";
import accountKitCircle from "../../../public/assets/account-kit-circle.svg";
import accountKitText from "../../../public/assets/account-kit-text.svg";
import { BANNER_STATES } from "../utils/Banner";

export default function NftHome({
  setHasMinted,
  isMinting,
  setIsMinting,
  setBannerState,
  setUserOpHash,
  setTxHash,
  userOpHash,
  txHash,
  setError,
}: any) {
  const { login, isLoggedIn, provider } = useWalletContext();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  useInterval(async () => {
    if (isMinting && !txHash && userOpHash && provider) {
      console.log("in interval useeffect for UO: ", userOpHash);
      const receipt = await provider
        .getUserOperationReceipt(userOpHash as `0x${string}`)
        .catch(() => null);
      if (receipt) {
        const txHash = await provider
          .getTransaction(receipt.receipt.transactionHash)
          .then((x: any) => (x as Transaction).hash);
        console.log("UserOp mined. tx", txHash);

        setTxHash(txHash);
        setBannerState(BANNER_STATES.TX_HASH);

        const txReceipt = await provider.rpcClient.waitForTransactionReceipt({
          hash: txHash,
        });

        setIsMinting(false);
        handleScroll("wallet");
        setHasMinted(true);
        setUserOpHash(undefined);
        setBannerState(BANNER_STATES.MINT_SUCCESS);

        console.log(txHash, txReceipt);
        setTimeout(() => {
          setBannerState(BANNER_STATES.NONE);
        }, 10000);
      }
    }
  }, 3000);

  const handleMint = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    setHasMinted(false);
    setTxHash(undefined);
    setIsMinting(true);
    setBannerState(BANNER_STATES.MINT_STARTED);

    try {
      const uoHash = await provider.sendUserOperation({
        target: nftContractAddress,
        data: encodeFunctionData({
          abi: AccountKitNftMinterAbi,
          functionName: "mint",
          args: [await provider.getAddress()],
        }),
      });

      setUserOpHash(uoHash.hash);
      setBannerState(BANNER_STATES.USER_OP_HASH);
    } catch (e: any) {
      console.log(e);
      setError(e.details || e.message);
      setBannerState(BANNER_STATES.ERROR);
      setIsMinting(false);

      fetch("/api/log-error-to-slack/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: e.name,
          message: e.message,
          stack: e.stack,
          details: e.details,
        }),
      });
    }
  }, [provider]);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const handleLogin = useCallback(
    async (event: any) => {
      event.preventDefault();
      await login(email);
      setIsLoggingIn(false);
      setEmail(email);
      closeModal();
    },
    [login, email]
  );

  return (
    <div>
      <div className="relative mb-[-48px] md:mb-0 flex flex-col md:flex-row gap-10 md:gap-20 mx-6 md:mx-20 mt-12">
        <div className="flex items-center justify-center">
          <img
            src="https://raw.githubusercontent.com/AlvaroLuken/cryptopunks/main/accountkit.jpg"
            alt="sample nft"
            className="rounded-lg h-auto max-w-full lg:min-w-[540px] px-12 md:px-0 lg:max-h-[850px]"
          />
        </div>
        <div className="flex flex-col items-center gap-y-5 lg:mt-16 mb-24 lg:mb-0">
          <div
            className="relative inline-flex group float-on-hover"
            onClick={() => (isLoggedIn ? handleMint() : openModal())}
          >
            <div className="absolute z-[-1] transition-all duration-1000 opacity-20 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <button className="flex items-center text-3xl px-16 py-4 lg:px-28 lg:py-6 rounded-lg text-white bg-custom-gradient">
              <span
                className={`${
                  isMinting ? "loading loading-spinner mr-4" : "hidden"
                }`}
              ></span>
              {isMinting ? (
                <div className="font-mono font-bold">Minting</div>
              ) : isLoggedIn ? (
                <div className="font-mono font-bold">Mint</div>
              ) : (
                <div className="font-sans font-bold whitespace-nowrap md:whitespace-normal">
                  Login
                </div>
              )}
            </button>
          </div>
          <a
            className="flex font-mono cursor-pointer"
            href="https://accountkit.alchemy.com/introduction.html"
            target="_blank"
          >
            <div className="mt-1.5 mr-2 whitespace-nowrap">powered by</div>
            <Image src={accountKitCircle} alt="demo-logo" />
            <div className="mt-2.5 ml-2">
              <Image src={accountKitText} alt="svg-1" />
            </div>
          </a>
          <div
            className="text-left lg:mt-8"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              <div>
                <div className="text-xl lg:text-3xl">
                  <b>Mint an NFT with zero gas fees.</b>
                </div>
                <div className="mt-6 text-xl">
                  How it works: this demo app uses Account Kit to deploy an
                  ERC-4337 smart account, send a user operation, and sponsor
                  gas.
                </div>
              </div>
              <div className="mt-6  text-xl">
                Powered by ERC-4337 account abstraction.{" "}
              </div>
              <div className="text-xl mt-6">
                <a
                  href="https://accountkit.alchemy.com/introduction.html"
                  className="link link-primary"
                >
                  Start building
                </a>
                &nbsp;with account abstraction today!
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog className={`modal ${isLoggingIn && "modal-open"}`}>
        <div className="modal-box flex flex-col gap-[12px]">
          <h3 className="font-bold text-lg">Enter your email address:</h3>

          <form onSubmit={handleLogin}>
            <input
              placeholder="Email"
              onChange={onEmailChange}
              className="input border border-solid border-gray-400 w-full"
            />

            <div className="flex flex-row justify-end max-md:flex-col flex-wrap gap-[12px] mt-5">
              <button
                type="button"
                onClick={closeModal}
                className="btn bg-gradient-2transition ease-in-out duration-500 transform hover:scale-110"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary text-white bg-gradient-1transition ease-in-out duration-500 transform hover:scale-110"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
