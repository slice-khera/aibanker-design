import type { Metadata } from "next";
import { Rubik, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Agentation } from "agentation";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Slice Banker Prototype",
  description: "Chat-first personal banker prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${bricolage.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation endpoint="http://localhost:4747" />}
      </body>
    </html>
  );
}
