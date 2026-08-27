import type { Metadata } from "next";
import { GFS_Didot } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const gfsDidot = GFS_Didot({
  weight: "400",
  subsets: ["greek", "latin"],
  variable: "--font-didot",
});

export const metadata: Metadata = {
  title: "Weblog",
  description: "Weblog for Arts, Entertainment and Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={gfsDidot.variable}>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}