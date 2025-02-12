import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuLoad",
  description: "QuLoad is an open-source file-hosting web app that hosts files, specifically images or videos and converts them to links. This allows you to use the link wherever you want with the greatest flexibility.",
  keywords: [
    "quload",
    "upload",
    "file to link converter",
    "file hosting",
    "file to link",
    "link",
    "host files",
    "host image",
    "host video",
    "link hosting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
