import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import {
  OrganizationSchema,
  WebsiteSchema,
  SoftwareApplicationSchema,
  FinancialProductSchema,
} from "@/lib/seo";
import WalletProvider from "@/components/auth/WalletProvider";
import AuthProvider from "@/components/auth/AuthProvider";
import WalletAuthInitializer from "@/components/auth/WalletAuthInitializer";
import ProgramIdsInitializer from "@/components/solana/ProgramIdsInitializer";
import AnalyticsInitializer from "@/components/analytics/AnalyticsInitializer";
import { ToastProvider } from "@/components/shared/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#facc15" },
    { media: "(prefers-color-scheme: dark)", color: "#facc15" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <AuthProvider>
            <ToastProvider>
              <AnalyticsInitializer />
              <WalletAuthInitializer />
              <ProgramIdsInitializer />
              <OrganizationSchema />
              <WebsiteSchema />
              <SoftwareApplicationSchema />
              <FinancialProductSchema />
              {children}
            </ToastProvider>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
