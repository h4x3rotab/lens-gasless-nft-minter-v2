import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alchemy Simple AA Dapp",
  description: "A Simple Dapp That Uses Account Abstraction",
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
