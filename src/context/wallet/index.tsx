"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loader from "@/components/utils/Loader";
import { entryPointAddress } from "@/config/client";
import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { useMagicSigner } from "@/hooks/useMagicSigner";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { Address } from "@alchemy/aa-core";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WalletContextProps = {
  // Functions
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // Properties
  provider: AlchemyProvider;
  ownerAddress?: Address;
  scaAddress?: Address;
  username?: string;
  isLoggedIn: boolean;
};

const defaultUnset: any = null;
const WalletContext = createContext<WalletContextProps>({
  // Default Values
  provider: defaultUnset,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isLoggedIn: defaultUnset,
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [ownerAddress, setOwnerAddress] = useState<Address>();
  const [scaAddress, setScaAddress] = useState<Address>();
  const [username, setUsername] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const { magic, signer } = useMagicSigner();
  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider({ entryPointAddress });

  const login = useCallback(
    async (email: string) => {
      setIsLoading(true);
      if (!magic || !magic.user || !signer) {
        throw new Error("Magic not initialized");
      }

      const didToken = await magic.auth.loginWithEmailOTP({
        email,
      });
      const metadata = await magic.user.getMetadata();
      if (!didToken || !metadata.publicAddress || !metadata.email) {
        throw new Error("Magic login failed");
      }
      connectProviderToAccount(signer);
      setUsername(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);

      setIsLoggedIn(true);
      setIsLoading(false);

      setScaAddress(await provider.getAddress());
    },
    [magic, connectProviderToAccount, signer, provider, isLoading]
  );

  const logout = useCallback(async () => {
    if (!magic || !magic.user) {
      throw new Error("Magic not initialized");
    }

    if (!(await magic.user.logout())) {
      throw new Error("Magic logout failed");
    }

    setIsLoggedIn(false);
    disconnectProviderFromAccount();
    setUsername(undefined);
    setOwnerAddress(undefined);
    setScaAddress(undefined);
  }, [magic, disconnectProviderFromAccount]);

  useEffect(() => {
    async function fetchData() {
      if (!magic || !magic.user || !signer) {
        setIsLoading(false);
        throw new Error("Magic not initialized");
      }

      const isLoggedIn = await magic.user.isLoggedIn();

      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      const metadata = await magic.user.getInfo();
      if (!metadata.publicAddress || !metadata.email) {
        throw new Error("Magic login failed");
      }

      setIsLoggedIn(isLoggedIn);
      connectProviderToAccount(signer);
      setUsername(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);
      setIsLoading(false);
      setScaAddress(await provider.getAddress());
    }
    fetchData();
  }, [magic, connectProviderToAccount, signer, provider]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <Loader isTransfer={false} loadingMessage={"Loading"} />
        <Footer />
      </div>
    );
  }

  return (
    <WalletContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        provider,
        ownerAddress,
        scaAddress,
        username,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
