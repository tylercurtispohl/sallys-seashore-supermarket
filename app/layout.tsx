import Nav from "@/components/Nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sally's Seashore Supermaket",
  description: "Way more than seashells",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="p-5 flex flex-row justify-around">
          <div className="xl:w-2/3 w-full md:w-3/4 ">
            <Nav />
            <div className="mt-5 px-10 md:px-0">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
