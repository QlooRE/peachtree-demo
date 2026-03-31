import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peachtree Intelligence Hub",
  description: "Cultural intelligence for venue activation, sponsor alignment, and experience branding — powered by Qloo + Claude.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
