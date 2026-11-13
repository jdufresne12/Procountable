import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ClerkProvider, Show } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Procountable",
  description: "Your personal AI tutor",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full">
        <ClerkProvider
          appearance={{ variables: { colorPrimary: "#5b3df5" } }}
          afterSignOutUrl="/sign-in"
        >
          <Show when={"signed-in"}>
            <Navbar />
          </Show>

          <div className="flex min-w-0 flex-1 flex-col">
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}