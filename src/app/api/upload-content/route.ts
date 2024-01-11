import { NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

const bucket = process.env.S3_BUCKET!;
const accessKey = process.env.S3_ACCESS_KEY!;
const secretKey = process.env.S3_SECRET_KEY!;

const s3Instance = new S3({
  endpoint: "https://endpoint.4everland.co",
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: "eu-west-2",
});

export async function POST(req: Request) {
  const data = await req.arrayBuffer();
  const nodeBuffer = Buffer.from(data);
  const filename = `metadata/${Date.now().toString()}.json`;  // hack: unique file name
  await s3Instance.putObject({
    Bucket: bucket,
    Key: filename,
    Body: nodeBuffer,
    ContentType: 'application/json',
  });
  // Get File CID    
  const result = await s3Instance.headObject({
    Bucket: bucket,
    Key: filename,
  });
  const cid = result.Metadata!["ipfs-hash"];
  const contentURI = 'ipfs://' + cid;
  console.log('Upload success:', {contentURI});
  return NextResponse.json({contentURI});
}
