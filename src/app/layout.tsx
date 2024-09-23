import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "AI Buddy",
  description: "Crush job interviews with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
