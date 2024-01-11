import {getContract, parseAbi, createPublicClient, http} from "viem";
import { polygonMumbai } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(process.env.ALCHEMY_RPC_URL),
});

export const contract = getContract({
  // @ts-ignore
  address: process.env.CLAIM_CONTRACT,
  abi: parseAbi([
    'function getAllowList() public view returns (address[] memory)'
  ]),
  publicClient: publicClient,
});