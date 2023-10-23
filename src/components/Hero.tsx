"use client";
import { useWalletContext } from "@/context/wallet";
import { useEffect, useState } from "react";
import NftHome from "./nft/NftHome";
import WalletDisplay from "./nft/WalletDisplay";
import { BANNER_STATES, Banner } from "./utils/Banner";

interface Nft {
  contract: object;
  tokenId: string;
  tokenType: string;
  title: string;
  description: string;
  media: object;
}

interface Data {
  ownedNfts: Nft[];
  length: number;
}

export default function Hero() {
  const { isLoggedIn } = useWalletContext();
  const [ownedNftsArray, setOwnedNftsArray] = useState<Data | null>(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [bannerState, setBannerState] = useState(BANNER_STATES.NONE);
  const [userOpHash, setUserOpHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [hasTransferred, setHasTransferred] = useState(false);

  useEffect(() => {
    let timer: any;

    if (hasTransferred || hasMinted || error) {
      timer = setTimeout(() => {
        setBannerState(BANNER_STATES.NONE);
        setError("");
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [hasMinted, error, hasTransferred]);

  return (
    <div>
      <NftHome
        setBannerState={setBannerState}
        hasMinted={hasMinted}
        setHasMinted={setHasMinted}
        isMinting={isMinting}
        setIsMinting={setIsMinting}
        setUserOpHash={setUserOpHash}
        setTxHash={setTxHash}
        userOpHash={userOpHash}
        txHash={txHash}
        setError={setError}
        setSuccessMessage={setSuccessMessage}
      />
      <Banner
        state={bannerState}
        userOpHash={userOpHash}
        txHash={txHash}
        errorMessage={error}
        successMessage={successMessage}
        recipientAddress={recipientAddress}
      />
      {isLoggedIn ? (
        <WalletDisplay
          setBannerState={setBannerState}
          isMinting={isMinting}
          hasMinted={hasMinted}
          ownedNftsArray={ownedNftsArray}
          setOwnedNftsArray={setOwnedNftsArray}
          setError={setError}
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          setHasTransferred={setHasTransferred}
        />
      ) : (
        ""
      )}
    </div>
  );
}
