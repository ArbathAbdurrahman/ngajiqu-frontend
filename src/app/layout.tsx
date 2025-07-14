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
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo2.png" />
        <meta name="theme-color" content="#4CAF50" />
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
