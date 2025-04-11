"use client";
import React from "react";
import localFont from 'next/font/local';
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CookieConsent from "react-cookie-consent";
import Head from "next/head"; // Import Next.js <Head> component

const poppins = localFont({
  src: [
    {
      path: '../fonts/gastromondtest-regular.otf',
      weight: '400'
    },
  ],
  variable: '--gastromond'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
    <AuthProvider>
    <body>
      <HeadContent />
      <LayoutContent>{children}</LayoutContent>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        onAccept={() => console.log("Cookies accepted")}
        onDecline={() => console.log("Cookies declined")}
        style={{ background: "#c363d0", color: "#fff" }}
        buttonStyle={{ background: "#3b688c", color: "#fff", fontSize: "14px" }}
        declineButtonStyle={{ background: "#893553", color: "#fff", fontSize: "14px" }}
      >
        This site uses cookies.
      </CookieConsent>
    </body>
    </AuthProvider>
    </html>
  );
}

// ✅ Use Next.js <Head> inside this component, within AuthProvider
function HeadContent() {
  const { pageTitle } = useAuth();

  return (
    <Head>
      <title>{pageTitle}</title>
      <link rel="stylesheet" href="https://use.typekit.net/cml7lez.css" />
    </Head>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div id="flex-wrapper">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
