import { Alchemy, Network } from "alchemy-sdk";
import { NextRequest, NextResponse } from "next/server";

const alchemy = new Alchemy({
  url: process.env.ALCHEMY_RPC_URL,
  network: Network.MATIC_MUMBAI,
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { address } = body;
  const nfts = await alchemy.nft.getNftsForOwner(address);

  return NextResponse.json({
    data: nfts,
  });
}
