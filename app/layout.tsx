import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";

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
