import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import 'rsuite/dist/rsuite-no-reset.min.css';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "NgajiQu",
  description: "Platform pembelajaran Al-Quran",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
