'use client';

import { PhantomProvider } from "@phantom/react-sdk";
import { phantomConfig } from "@/lib/phantom/config";
import { getPhantomTheme } from "@/lib/phantom/theme";
import { ReactNode, useEffect, useState } from "react";

interface PhantomProviderWrapperProps {
  children: ReactNode;
}

export default function PhantomProviderWrapper({ children }: PhantomProviderWrapperProps) {
  const [theme, setTheme] = useState(getPhantomTheme());

  // Reactively update theme when system preference changes
  useEffect(() => {
    const updateTheme = () => {
      setTheme(getPhantomTheme());
    };

    // Check initial theme
    updateTheme();

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
    };
  }, []);

  return (
    <PhantomProvider
      config={phantomConfig}
      theme={theme}
      appIcon="/icon.png"
      appName="Inventagious"
    >
      {children}
    </PhantomProvider>
  );
}

