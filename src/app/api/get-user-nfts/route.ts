import { NextRequest, NextResponse } from "next/server";

const { Alchemy, Network } = require("alchemy-sdk");

const alchemy = new Alchemy({
  url: process.env.ALCHEMY_API_URL,
  network: Network.ARB_GOERLI,
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { address } = body;
  const nfts = await alchemy.nft.getNftsForOwner(address);

  //console.log(nfts);

  return NextResponse.json({
    data: nfts,
  });
}
