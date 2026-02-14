import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "¿Quieres ser mi San Valentín?",
  description: "Una propuesta especial de San Valentín",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={pacifico.variable}>
      <body className="antialiased font-sans bg-gradient-to-br from-pink-100 to-rose-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
