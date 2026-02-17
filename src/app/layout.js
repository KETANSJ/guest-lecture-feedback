import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Guest Lecture Feedback System",
  description: "Online Guest Lecture Feedback & Admin Analytics Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Guest Lecture Feedback System</title>
        <meta
          name="description"
          content="Online Guest Lecture Feedback & Admin Analytics Dashboard"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
