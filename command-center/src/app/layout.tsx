import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crime Analytics Command Center | AI-Powered Law Enforcement Intelligence",
  description:
    "Next-generation intelligent conversational AI and crime analytics command center for law enforcement. Real-time threat monitoring, criminal network analysis, and predictive intelligence.",
  keywords: [
    "crime analytics",
    "law enforcement",
    "AI",
    "command center",
    "criminal network analysis",
    "threat intelligence",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-foreground">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
