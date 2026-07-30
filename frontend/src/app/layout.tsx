import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConditionalPageShell } from "@/components/layout/ConditionalPageShell";
import { ToastProvider } from "@/components/ui/Toast";
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
  title: {
    default: "Sai Krishna Gottapu | Sr. Software Engineer",
    template: "%s | Sai Krishna Gottapu",
  },
  description:
    "Senior Software Engineer with 7+ years in Java, Spring Boot, and full-stack development. Available for new opportunities.",
  authors: [{ name: "Sai Krishna Gottapu" }],
  keywords: [
    "software engineer",
    "Java",
    "Spring Boot",
    "full stack",
    "Denver",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sai Krishna Gottapu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:outline-none"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ConditionalPageShell>{children}</ConditionalPageShell>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
