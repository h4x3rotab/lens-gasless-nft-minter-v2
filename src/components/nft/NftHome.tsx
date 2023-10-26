import {
  AccountKitNftMinterAbi,
  nftContractAddress,
} from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import { useInterval } from "@/hooks/useInterval";
import { useCallback, useState } from "react";
import { Transaction, encodeFunctionData } from "viem";
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
            <svg
              width="34"
              height="34"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.8936 29.8937C23.1191 29.8937 29.7872 23.2256 29.7872 15.0001C29.7872 6.77454 23.1191 0.106445 14.8936 0.106445C6.6681 0.106445 0 6.77454 0 15.0001C0 23.2256 6.6681 29.8937 14.8936 29.8937Z"
                fill="url(#paint0_linear_1223_11007)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.8431 6.43652C12.3945 6.43652 11.9642 6.61475 11.647 6.93198C11.3297 7.24922 11.1515 7.67949 11.1515 8.12813V9.2218C11.1515 9.42744 10.9848 9.59414 10.7792 9.59414H7.92208C7.47343 9.59414 7.04317 9.77237 6.72593 10.0896C6.40869 10.4068 6.23047 10.8371 6.23047 11.2858V14.5665C6.23047 15.0151 6.40869 15.4454 6.72593 15.7626C6.86427 15.9009 7.0241 16.0128 7.19758 16.0951C7.34806 16.1664 7.46076 16.3089 7.46076 16.4754V20.7175C7.46076 21.2749 7.68218 21.8095 8.07633 22.2036C8.47047 22.5978 9.00505 22.8192 9.56245 22.8192H20.2247C20.7821 22.8192 21.3167 22.5978 21.7108 22.2036C22.105 21.8095 22.3264 21.2749 22.3264 20.7175V16.4754C22.3264 16.3089 22.4391 16.1664 22.5896 16.095C22.763 16.0128 22.9229 15.9009 23.0612 15.7626C23.3784 15.4454 23.5566 15.0151 23.5566 14.5665V11.2858C23.5566 10.8371 23.3784 10.4068 23.0612 10.0896C22.744 9.77237 22.3137 9.59414 21.865 9.59414H19.008C18.8023 9.59414 18.6356 9.42744 18.6356 9.2218V8.12813C18.6356 7.67949 18.4574 7.24922 18.1402 6.93198C17.8229 6.61475 17.3926 6.43652 16.944 6.43652H12.8431ZM17.7548 11.337C17.7579 11.337 17.7611 11.3371 17.7642 11.3371C17.7673 11.3371 17.7704 11.337 17.7735 11.337H21.4414C21.6471 11.337 21.8138 11.5037 21.8138 11.7094V14.1779C21.8138 14.3642 21.6628 14.5152 21.4765 14.5152L21.455 14.5149L21.4334 14.5152H8.35374L8.33219 14.5149L8.31064 14.5152C8.12435 14.5152 7.97334 14.3642 7.97334 14.1779V11.7094C7.97334 11.5037 8.14004 11.337 8.34568 11.337H12.0136C12.0167 11.337 12.0198 11.3371 12.023 11.3371C12.0261 11.3371 12.0292 11.337 12.0323 11.337H17.7548ZM16.5204 9.59414C16.726 9.59414 16.8927 9.42744 16.8927 9.2218V8.55173C16.8927 8.3461 16.726 8.17939 16.5204 8.17939H13.2667C13.0611 8.17939 12.8944 8.3461 12.8944 8.55173V9.2218C12.8944 9.42744 13.0611 9.59414 13.2667 9.59414H16.5204ZM9.20363 20.7175V16.6304C9.20363 16.4248 9.37033 16.2581 9.57597 16.2581H20.2112C20.4168 16.2581 20.5835 16.4248 20.5835 16.6304V20.7175C20.5835 20.8127 20.5457 20.9039 20.4784 20.9712C20.4111 21.0385 20.3199 21.0763 20.2247 21.0763H9.56245C9.46729 21.0763 9.37602 21.0385 9.30872 20.9712C9.24143 20.9039 9.20363 20.8127 9.20363 20.7175Z"
                fill="url(#paint1_linear_1223_11007)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1223_11007"
                  x1="0"
                  y1="0.106445"
                  x2="31.2132"
                  y2="28.3159"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF9C27" />
                  <stop offset="1" stopColor="#FD48CE" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1223_11007"
                  x1="14.8936"
                  y1="6.43652"
                  x2="14.8936"
                  y2="22.8192"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.166667" stopColor="white" />
                  <stop offset="1" stopColor="white" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-2.5 ml-2">
              <svg
                width="99"
                height="14"
                viewBox="0 0 99 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.06215 13H0.612787L5.47406 0.221275H8.70896L13.606 13H10.0851L9.263 10.337H4.88428L4.06215 13ZM7.0647 3.17021L5.61704 7.88851H8.54811L7.10045 3.17021H7.0647ZM18.3494 13.3038C15.4541 13.3038 13.6311 11.2843 13.6311 8.42468C13.6311 5.58298 15.4541 3.54553 18.2779 3.54553C20.923 3.54553 22.5315 5.1183 22.7639 7.26298H19.8864C19.7971 6.51234 19.4754 5.69021 18.3315 5.69021C17.152 5.69021 16.5622 6.70894 16.5622 8.42468C16.5622 10.1404 17.1341 11.1591 18.3315 11.1591C19.4575 11.1591 19.7971 10.3906 19.8864 9.55064H22.7639C22.6209 11.7311 20.9766 13.3038 18.3494 13.3038ZM28.337 13.3038C25.4417 13.3038 23.6187 11.2843 23.6187 8.42468C23.6187 5.58298 25.4417 3.54553 28.2655 3.54553C30.9106 3.54553 32.5191 5.1183 32.7514 7.26298H29.874C29.7846 6.51234 29.4629 5.69021 28.3191 5.69021C27.1395 5.69021 26.5497 6.70894 26.5497 8.42468C26.5497 10.1404 27.1217 11.1591 28.3191 11.1591C29.4451 11.1591 29.7846 10.3906 29.874 9.55064H32.7514C32.6085 11.7311 30.9642 13.3038 28.337 13.3038ZM38.4675 13.3038C35.4471 13.3038 33.6062 11.3379 33.6062 8.44255C33.6062 5.56511 35.4471 3.54553 38.5211 3.54553C41.5416 3.54553 43.3824 5.51149 43.3824 8.38894C43.3824 11.2843 41.5416 13.3038 38.4675 13.3038ZM38.5033 11.1591C39.7722 11.1591 40.4871 10.194 40.4871 8.42468C40.4871 6.65532 39.7722 5.69021 38.5033 5.69021C37.2165 5.69021 36.5016 6.65532 36.5016 8.42468C36.5016 10.194 37.2165 11.1591 38.5033 11.1591ZM50.689 9.13957V3.84936H53.5486V13H50.689V11.6774H50.6532C50.1707 12.5174 49.2771 13.286 47.6507 13.286C45.8813 13.286 44.6839 12.1243 44.6839 10.0332V3.84936H47.5435V9.1217C47.5435 10.4979 48.026 10.9626 48.9732 10.9626C50.0635 10.9626 50.689 10.4085 50.689 9.13957ZM61.1989 3.5634C62.9683 3.5634 64.1657 4.72511 64.1657 6.81617V13H61.3061V7.72766C61.3061 6.35149 60.8236 5.88681 59.8764 5.88681C58.7861 5.88681 58.1606 6.44085 58.1606 7.70979V13H55.301V3.84936H58.1606V5.17191H58.1964C58.6789 4.33191 59.5725 3.5634 61.1989 3.5634ZM70.299 11.034C70.5671 11.034 70.7279 11.0162 71.0675 10.9626V12.9821C70.4599 13.1251 69.9416 13.1787 69.3696 13.1787C67.3679 13.1787 66.5101 12.2672 66.5101 10.0332V5.99404H65.2411V3.84936H66.5101V1.29362H69.3696V3.84936H70.9603V5.99404H69.3696V9.9617C69.3696 10.9447 69.745 11.034 70.299 11.034ZM87.9509 13H84.1977L80.8913 8.01362L79.5687 9.55064V13H76.3517V0.221275H79.5687V5.67234L84.1441 0.221275H87.5934L82.7858 5.81532L87.9509 13ZM91.4437 2.75915H88.5841V0.221275H91.4437V2.75915ZM91.4437 13H88.5841V3.84936H91.4437V13ZM97.7177 11.034C97.9858 11.034 98.1466 11.0162 98.4862 10.9626V12.9821C97.8785 13.1251 97.3602 13.1787 96.7883 13.1787C94.7866 13.1787 93.9287 12.2672 93.9287 10.0332V5.99404H92.6598V3.84936H93.9287V1.29362H96.7883V3.84936H98.379V5.99404H96.7883V9.9617C96.7883 10.9447 97.1636 11.034 97.7177 11.034Z"
                  fill="black"
                />
              </svg>
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
                type="button" // Specify the type so it doesn't trigger form submission
                onClick={closeModal}
                className="btn bg-gradient-2transition ease-in-out duration-500 transform hover:scale-110"
              >
                Close
              </button>
              <button
                type="submit" // This will submit the form
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
