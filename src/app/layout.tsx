import type { Metadata } from "next";
<<<<<<< HEAD
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
=======
import "./globals.css";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A clean start for my Next.js project",
>>>>>>> db9a9e2 (Initial commit from Create Next App)
};

export default function RootLayout({
  children,
<<<<<<< HEAD
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
=======
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
>>>>>>> db9a9e2 (Initial commit from Create Next App)
    </html>
  );
}
