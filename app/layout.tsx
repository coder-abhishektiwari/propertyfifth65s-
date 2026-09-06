import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SnackbarProvider } from "@/components/snackbar/snackbar-provider";
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
  title: "Property Fifth",
  description: "Premium real estate advisory",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SnackbarProvider>{children}</SnackbarProvider>
      </body>
    </html>
  );
}
