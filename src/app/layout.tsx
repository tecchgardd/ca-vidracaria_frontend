import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// FontAwesome config
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CA Vidraçaria e Esquadrias de Alumínio",
  description:
    "Soluções em vidro e esquadrias de alumínio com qualidade, segurança e sofisticação.",

  keywords: [
    "vidraçaria",
    "esquadrias de alumínio",
    "vidros",
    "portões de alumínio",
    "fachadas",
    "divisória de ambiente",
    "persiana integrada",
    "Palhoça",
    "Santa Catarina",
    "CA Vidraçaria",
  ],

  authors: [{ name: "CA Vidraçaria" }],
  creator: "CA Vidraçaria",
  publisher: "CA Vidraçaria",

  metadataBase: new URL("https://cavidracaria.com.br"),

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },

  openGraph: {
    title: "CA Vidraçaria e Esquadrias de Alumínio",
    description:
      "Soluções em vidro e esquadrias de alumínio com qualidade, segurança e sofisticação.",
    url: "https://cavidracaria.com.br",
    siteName: "CA Vidraçaria",
    locale: "pt_BR",
    type: "website",

    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "CA Vidraçaria e Esquadrias de Alumínio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CA Vidraçaria e Esquadrias de Alumínio",
    description:
      "Soluções em vidro e esquadrias de alumínio com qualidade, segurança e sofisticação.",
    images: ["/assets/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {children}
      </body>
    </html>
  );
}