import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";

export const metadata: Metadata = {
  title: "Mission Workflow Map",
  description: "Explore how mission ministry workflows connect — what comes next, what tools to use, and how they fit together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
