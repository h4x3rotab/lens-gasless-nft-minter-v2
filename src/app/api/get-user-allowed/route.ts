import { Alchemy, Network } from "alchemy-sdk";
import { NextRequest, NextResponse } from "next/server";

import { contract } from "../../allowListContract";

async function readActionAllowlist() {
  const allowList = await contract.read.getAllowList();
  // console.log({allowList});
  return allowList;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { address } = body;
  const allowed = await readActionAllowlist();
  return NextResponse.json({
    data: allowed.includes(address),
  });
}

export async function GET(request: NextRequest) {
  const allowed = await readActionAllowlist();
  return NextResponse.json({
    data: allowed,
  });
}
