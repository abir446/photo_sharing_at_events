import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import JsonLd from "@/components/JsonLd";

const BASE_URL = "https://photo-sharing-at-events-liard.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "DropCast — Book Event Photographers & Share Photos",
    template: "%s | DropCast",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  description:
    "Book vetted event photographers, set up instant QR photo galleries, and collect every guest photo in one place. Escrow-backed payments, real-time uploads, no app required.",
  keywords: [
    "book event photographer",
    "hire photographer",
    "event photography",
    "wedding photographer booking",
    "QR photo gallery",
    "event photo sharing",
    "photographer marketplace",
    "guest photo upload",
    "escrow photographer payment",
    "DropCast",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DropCast",
    title: "DropCast — Book Event Photographers & Share Photos",
    description:
      "Book vetted event photographers, set up instant QR photo galleries, and collect every guest photo in one place.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "DropCast — Book Event Photographers & Share Photos",
    description:
      "Book vetted event photographers, set up instant QR photo galleries, and collect every guest photo in one place.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('dropcast_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved || (prefersDark ? 'dark' : 'dark');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-ink-900 text-slate-900 dark:text-slate-200 transition-colors duration-200">
        <Providers>
          <JsonLd />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
