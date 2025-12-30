import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Best Cardiology Hospital in Jaipur | Multispeciality Healthcare",
  description: "Best cardiology hospital in Jaipur offering comprehensive cardiac care and multispeciality healthcare with cutting-edge technology and compassionate expertise. Leading heart care since 1995.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

