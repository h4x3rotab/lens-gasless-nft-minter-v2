# Proof-of-Shilling Gas Sponsor AA Dapp page

This is a fork of [Alchemy Gasless NFT Minter Dapp](https://github.com/alchemyplatform/aa-sdk/tree/main/examples/alchemy-daapp). It's modified to allow gas sponsorship by sharing a Lens post. More details can be found [here](https://github.com/h4x3rotab/hookathon-mirror-for-gas).

You should copy `.env.example` to `.env` and fill in all the info before running the service. You will need to preapre:

- An [Alchemy](https://dashboard.alchemy.com/) account for `ALCHEMY_KEY`
- An Alchemy project for `ALCHEMY_RPC_URL`
- An Alchemy Account Abstraction policy for `NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID`
- An [4everland](https://dashboard.4everland.org) IPFS bucket for `S3_BUCKET`, `S3_ACCESS_KEY`, and `S3_SECRET_KEY`


## Run Locally @ [http://localhost:3000](http://localhost:3000)

```bash
yarn
yarn build
yarn dev
```
