import { Fira_Code as FiraCode, Fira_Mono as FiraMono, Inter as InterFont } from "next/font/google";
import "./globals.css";

const firaCode = FiraCode({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const firaMono = FiraMono({
  weight: ["400", "500", "700"],
  variable: "--font-fira-mono",
  subsets: ["latin"],
});

const interFont = InterFont({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Wordle Game",
  description: "Guess the word | Tebak kata",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${firaCode.variable} ${firaMono.variable} ${interFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
