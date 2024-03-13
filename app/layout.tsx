"use client";

import "../styles/globals.css";
import Nav from "@/components/Nav";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <title>Admin</title>
      <body className="bg-gradient-to-b from-purple-400 via-pink-200 to-blue-200">
        <SessionProvider>
          {pathname !== "/" && <Nav />}
          <main className="">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
