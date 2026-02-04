import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import Header from "@/components/layout/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OfflineAcad",
  description: "Learn offline, anywhere, anytime. Education for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UIProvider>
            <Header />
            {children}

            {/* ✅ Global Toast Provider */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
              }}
            />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
