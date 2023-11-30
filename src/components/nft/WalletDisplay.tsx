import {
  AccountKitNftMinterAbi,
  nftContractAddress,
} from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import { useInterval } from "@/hooks/useInterval";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Transaction, encodeFunctionData } from "viem";
import { BANNER_STATES } from "../utils/Banner";
import Loader from "../utils/Loader";

export default function WalletDisplay({
  hasMinted,
  ownedNftsArray,
  setOwnedNftsArray,
  isMinting,
  setError,
  setBannerState,
  recipientAddress,
  setRecipientAddress,
  setHasTransferred,
}: any) {
  const { provider } = useWalletContext();

  const [isLoading, setIsLoading] = useState(false);
  const [transferNftTokenId, setTransferNftTokenId] = useState(-1);
  const [isTransferring, setIsTransferring] = useState(false);
  const [userOpHash, setUserOpHash] = useState("");
  const [txHash, setTxHash] = useState("");

  useInterval(async () => {
    if (isTransferring && !txHash && userOpHash && provider) {
      const receipt = await provider
        .getUserOperationReceipt(userOpHash as `0x${string}`)
        .catch(() => null);
      if (receipt) {
        const txHash = await provider
          .getTransaction(receipt.receipt.transactionHash)
          .then((x: any) => (x as Transaction).hash);

        setTxHash(txHash);
        setBannerState(BANNER_STATES.TX_HASH);

        const txReceipt = await provider.rpcClient.waitForTransactionReceipt({
          hash: txHash,
        });

        setIsTransferring(false);
        setHasTransferred(true);
        setBannerState(BANNER_STATES.TRANSFER_SUCCESS);
        handleScroll("wallet");
        fetchUserNfts();
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }
  }, 4000);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchUserNfts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = { address: await provider.getAddress() };
      const response = await fetch("/api/get-user-nfts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const messageResponse = await response.json();
      setOwnedNftsArray(messageResponse.data.ownedNfts);
    } catch (e: any) {
      setError(e.details);
    }
    setIsLoading(false);
  }, [provider, setError, setOwnedNftsArray]);

  useEffect(() => {
    fetchUserNfts();
  }, [fetchUserNfts, hasMinted]);

  async function constructNftTransfer(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (document) {
      (document.getElementById("my_modal_2") as HTMLFormElement).showModal();
    }
    setTransferNftTokenId(Number(event.currentTarget.id));
  }

  const finalizeNftTransfer = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    setIsTransferring(true);
    setBannerState(BANNER_STATES.MINT_STARTED);

    try {
      const uoHash = await provider.sendUserOperation({
        target: nftContractAddress,
        data: encodeFunctionData({
          abi: AccountKitNftMinterAbi,
          functionName: "transfer",
          args: [recipientAddress, transferNftTokenId],
        }),
      });
      setUserOpHash(uoHash.hash);
      setBannerState(BANNER_STATES.USER_OP_HASH);
    } catch (e: any) {
      setError(e.details || e.message);
      setBannerState(BANNER_STATES.ERROR);
      setIsTransferring(false);
    }
  }, [
    provider,
    recipientAddress,
    setBannerState,
    setError,
    transferNftTokenId,
  ]);

  function truncateDescription(description: string, wordCount: number) {
    const words = description.split(" ");
    if (words.length > wordCount) {
      const truncatedWords = words.slice(0, wordCount);
      return `${truncatedWords.join(" ")} ...`;
    }
    return description;
  }

  if (isTransferring) {
    return (
      <Loader
        isTransfer={true}
        loadingMessage={`Transferring your NFT to ${recipientAddress}`}
      />
    );
  }

  function handleRecipientInput(recipient: any) {
    setRecipientAddress(recipient);
  }

  return (
    <div className="mt-2 mb-6 md:my-16 mx-6 md:mx-20">
      <div id="wallet" className="mb-6 font-mono text-3xl font-bold">
        Your Wallet
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center mt-[-320px] mb-16 md:mt-[-350px] md:mb-0">
          <Loader isTransfer={true} loadingMessage="Fetching your NFTs..." />
        </div>
      ) : ownedNftsArray && ownedNftsArray.length >= 1 ? (
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-y-12 mb-6 mx-0">
            {ownedNftsArray &&
              Array.isArray(ownedNftsArray) &&
              ownedNftsArray.map((nft, index) => (
                <div
                  key={index}
                  className="rounded-lg shadow-xl max-w-[250px] max-h-[600px] overflow-hidden"
                >
                  <figure>
                    <Image
                      src={
                        "https://static.alchemyapi.io/assets/accountkit/accountkit.jpg"
                      }
                      alt="user nft image"
                      className="w-full max-h-[300px]"
                      width={300}
                      height={300}
                    />
                  </figure>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{nft.title}</h2>
                    <p>{truncateDescription(nft.description, 25)}</p>
                    <div className="flex justify-end">
                      <button
                        className="btn btn-secondary text-white mt-3 w-full"
                        id={nft.tokenId}
                        onClick={constructNftTransfer}
                      >
                        Transfer
                      </button>
                      <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-sm">
                            Enter a Polygon Mumbai testnet address to send this
                            NFT to:
                          </h3>
                          <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full mt-4"
                            onChange={(e) =>
                              handleRecipientInput(e.target.value)
                            }
                          />

                          <div className="modal-action">
                            <form method="dialog">
                              <button
                                type="submit"
                                id={nft.tokenId}
                                onClick={finalizeNftTransfer}
                                className="btn btn-primary text-white"
                              >
                                {isTransferring
                                  ? "Transferring"
                                  : "Transfer Now!"}
                              </button>
                            </form>
                          </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>
          {isMinting ? (
            <div className="flex items-center justify-center mt-[-320px] mb-16 md:mt-[-350px] md:mb-0">
              <Loader loadingMessage="Minting your NFT..." />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center md:mx-8 md:mt-12 text-xl">
              <div>
                Your smart contract wallet does not own any NFTs yet! 🤯
              </div>
              <div className="mt-4 mb-8 md:mb-0 md:text-center">
                Mint one with zero gas fees by clicking the <b>Mint</b> button
                above. ⬆️
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
