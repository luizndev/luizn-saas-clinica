import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgendaFácil",
  description: "AgendaFácil",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return (
    <html lang="pt-br">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <AuthGuard currentPath={pathname}>
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </AuthGuard>
        <Toaster richColors theme="light" />
      </body>
    </html>
  );
}
