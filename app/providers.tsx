"use client";

import React from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// Theme configured to match the application's aesthetic
const theme = createTheme({
  primaryColor: "brand",
  fontFamily: "var(--font-sans), Inter, sans-serif",
  colors: {
    brand: [
      "#eef2ff",
      "#e0e7ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#6366f1", // brand-500 Indigo
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
    ],
    // Dark slate background overrides
    dark: [
      "#c1c2c5",
      "#a6a7ab",
      "#909296",
      "#5c5f66",
      "#373a40",
      "#2c2e33",
      "#25262b",
      "#1e293b", // slate-800
      "#0f172a", // slate-900 / ink-900
      "#0b1120", // ink-950
    ],
  },
  primaryShade: 5,
});

function MantineThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme: currentTheme, mounted } = useTheme();
  const colorScheme = mounted ? currentTheme : "dark";

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
      forceColorScheme={colorScheme}
    >
      {children}
    </MantineProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MantineThemeWrapper>{children}</MantineThemeWrapper>
    </ThemeProvider>
  );
}
