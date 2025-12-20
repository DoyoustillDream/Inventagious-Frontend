import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import {
  OrganizationSchema,
  WebsiteSchema,
  SoftwareApplicationSchema,
  FinancialProductSchema,
} from "@/lib/seo"; 
import PhantomProviderWrapper from "@/components/auth/PhantomProviderWrapper";
import AuthProvider from "@/components/auth/AuthProvider";
import { WalletAuthProvider } from "@/components/auth/WalletAuthProvider";
import WalletAuthInitializer from "@/components/auth/WalletAuthInitializer";
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
        <PhantomProviderWrapper>
          <AuthProvider>
            <WalletAuthProvider>
              <ToastProvider>
                <Suspense fallback={null}>
                  <AnalyticsInitializer />
                </Suspense>
                <WalletAuthInitializer />
                <OrganizationSchema />
                <WebsiteSchema />
                <SoftwareApplicationSchema />
                <FinancialProductSchema />
                {children}
              </ToastProvider>
            </WalletAuthProvider>
          </AuthProvider>
        </PhantomProviderWrapper>
      </body>
    </html>
  );
}
