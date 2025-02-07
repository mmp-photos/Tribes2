import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";

const poppins = localFont({
  src: [
    {
      path: '../fonts/gastromondtest-regular.otf',
      weight: '400'
    },
  ],
  variable: '--gastromond'
})

export const metadata: Metadata = {
  title: 'Tribes of Men',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/cml7lez.css" />
      </head>
      <body>
        <div id="flex-wrapper">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        </div>
      </body>
    </html>
  );
}
