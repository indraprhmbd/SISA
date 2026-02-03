import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SISA - AI Nutrition Decision Engine",
  description: "Decide what to cook based on protein needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
