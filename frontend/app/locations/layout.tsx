import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Offices",
  description: "Find our strategic headquarters in Kinshasa and Shenzhen.",
};

// Le "export default" est obligatoire pour que Next.js fonctionne
export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}