import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vibecodin.gg",
  description:
    "An open source library of skills and agents for LLMs, organized into business domain hubs.",
  metadataBase: new URL("https://vibecodin.gg"),
  openGraph: {
    title: "vibecodin.gg",
    description:
      "Open source skills & agents for LLMs, organized into business domain hubs.",
    siteName: "vibecodin.gg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vibecodin.gg",
    description:
      "Open source skills & agents for LLMs, organized into business domain hubs.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
