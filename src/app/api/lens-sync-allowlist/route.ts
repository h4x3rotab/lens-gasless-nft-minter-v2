import { Alchemy, Network } from "alchemy-sdk";
import { NextRequest, NextResponse } from "next/server";

// const alchemy = new Alchemy({
//   url: process.env.ALCHEMY_RPC_URL,
//   network: Network.MATIC_MUMBAI,
// });

const accessKey = process.env.ALCHEMY_ACCESS_KEY;
const policyId = process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID;

async function getPolicy(): Promise<any> {
  const response = await fetch(`https://manage.g.alchemy.com/api/gasManager/policy/${policyId}`, {
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${accessKey}`,
    }
  });
  const { data: { policy: {policyName, rules} } } = await response.json();
  return {policyName, rules};
}

async function updatePolicy(data: any): Promise<void> {
  /*
curl --request PUT \
     --url https://manage.g.alchemy.com/api/gasManager/policy/a844e221-3c13-40c6-95db-d2db390e14b5 \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "policyName": "My Policy",
  "rules": {
    "maxSpendUsd": "5000.00",
    "maxSpendPerSenderUsd": "100.00",
    "maxSpendPerUoUsd": "20.00",
    "maxCount": "100",
    "maxCountPerSender": "2",
    "senderAllowlist": [
      "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
    ],
    "startTimeUnix": "1674228753",
    "endTimeUnix": "1679340742",
    "sponsorshipExpiryMs": "600000"
  }
}
'
  */
  const response = await fetch(`https://manage.g.alchemy.com/api/gasManager/policy/${policyId}`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${accessKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

async function readActionAllowlist() {
  // viem:
  // get contract
  // query contract
  // return full list
}

export async function GET(request: NextRequest) {
  const policy = await getPolicy();
  const toAdd = '0xEFEc70dcf64cB12dC4D46fc7a3a7d05b1b098526';
  // DEMO update

  // @ts-ignore
  const allowlist = policy.rules.senderAllowlist || [];
  if (!allowlist.includes(toAdd)) {
    // @ts-ignore
    allowlist.push(toAdd);
  }
  policy.rules.senderAllowlist = allowlist;

  const resp = await updatePolicy(policy)
  // const resp = {};
  return NextResponse.json({resp});
}
