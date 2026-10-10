import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর | BazarDor",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, মূল্যবৃদ্ধি ও মূল্যহ্রাসের তথ্য এক জায়গায়।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.className} antialiased`}>
        {children}
        <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "14px 18px",
      },
      success: {
        iconTheme: {
          primary: "#059669",
          secondary: "#ffffff",
        },
      },
    }}
  />
      </body>
    </html>
  );
}