"use client";
import { useWalletContext } from "@/context/wallet";
import { useState } from "react";
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

type MintStatus =
  | "Mint"
  | "Requesting"
  | "Minting"
  | "Received"
  | "Error Minting";

export default function Hero() {
  const { isLoggedIn, provider } = useWalletContext();
  const [ownedNftsArray, setOwnedNftsArray] = useState<Data | null>(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [bannerState, setBannerState] = useState(BANNER_STATES.NONE);
  const [userOpHash, setUserOpHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

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
      />
      <Banner
        state={bannerState}
        userOpHash={userOpHash}
        txHash={txHash}
        errorMessage={error}
      />
      {isLoggedIn ? (
        <WalletDisplay
          setBannerState={setBannerState}
          isMinting={isMinting}
          hasMinted={hasMinted}
          ownedNftsArray={ownedNftsArray}
          setOwnedNftsArray={setOwnedNftsArray}
          setError={setError}
        />
      ) : (
        ""
      )}
    </div>
  );
}
