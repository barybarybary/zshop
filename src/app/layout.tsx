import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ZShop - Group Buy & Save Big!",
    template: "%s | ZShop",
  },
  description:
    "Shop smart with ZShop! Join group buys, bargain for the best prices, and save big on trending products. Free shipping on orders over $50.",
  keywords: ["online shopping", "group buy", "bargain", "deals", "discount"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          {children}
          <Toaster position="top-center" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
