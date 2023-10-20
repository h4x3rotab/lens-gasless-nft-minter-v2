// import {
//   type SimpleSmartAccountOwner,
//   LightSmartContractAccount,
//   SmartAccountProvider,
// } from "@alchemy/aa-core";
import { type LightSmartContractAccount } from "@alchemy/aa-accounts";
import { SmartAccountProvider } from "@alchemy/aa-core";
import { privateKeyToAccount } from "viem/accounts";
import { toHex } from "viem/utils";
import { sepolia } from "viem/chains";


// TO DO: Replace for LA
const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
  "0x9406Cc6185a346906296840746125a0E44976454";


export default function TestComponent() {
  return <div></div>;
}
