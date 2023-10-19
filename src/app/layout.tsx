import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Account Kit Demo",
  description: "A Gasless NFT Minter That Uses Alchemy's Account Kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
