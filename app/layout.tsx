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
      <body>
        <SessionProvider>
          {pathname !== "/" && <Nav />}
          <main className="">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
