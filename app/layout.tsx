"use client";
import Nav from "@/components/Nav";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { cyan } from "@mui/material/colors";

const inter = Inter({ subsets: ["latin"] });

// override the primary color to match the cyan logo
const theme = createTheme({
  palette: {
    primary: cyan,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <title>Sally&apos;s Seashore Supermarket</title>
        </head>
        <body className={inter.className}>
          <main className="p-5 flex flex-row justify-around">
            <div className="xl:w-2/3 w-full lg:w-3/4 ">
              <Nav />
              <div className="mt-5 px-10 lg:px-0">{children}</div>
            </div>
          </main>
        </body>
      </html>
    </ThemeProvider>
  );
}
