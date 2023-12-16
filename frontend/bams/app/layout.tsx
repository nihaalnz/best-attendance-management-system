import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import App from "@/components/query-provider";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/navbar";
import { getServerSession } from "next-auth";
import { config } from "@/auth";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(config);
  return (
    <html lang="en" suppressHydrationWarning>
      <App session={session}>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange>
            <Nav />
            <div className="container mt-20">{children}</div>
            <Toaster />
          </ThemeProvider>
        </body>
      </App>
    </html>
  );
}
