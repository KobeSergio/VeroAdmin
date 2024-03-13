import "../../styles/globals.css";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const metadata = {
  title: "Admin",
  description: "",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }
  return (
    <section className="min-h-[94vh] w-full bg-gradient-to-b from-purple-400 via-pink-200 to-blue-200 px-6 lg:px-12 py-6">
      {children}
    </section>
  );
}
