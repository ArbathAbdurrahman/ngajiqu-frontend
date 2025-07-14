import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import 'rsuite/dist/rsuite-no-reset.min.css';
import { CustomProvider } from "rsuite";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "NgajiQu",
  description: "Progres Ngaji di Ujung Jari, Terpantau Sepenuh Hati",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json"></link>
      </head>
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <CustomProvider>
          {children}
        </CustomProvider>
      </body>
    </html>
  );
}
