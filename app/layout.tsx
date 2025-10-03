import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import ClientLayoutWrapper from "./components/client-layout-wrapper";
import QueryProvider from "./providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DoughVault",
  description: "Streamlined inventory management for pizza shops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <QueryProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
