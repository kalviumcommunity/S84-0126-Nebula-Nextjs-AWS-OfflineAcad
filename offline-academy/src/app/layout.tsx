import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Offline Academy | Learn Anywhere",
  description: "A secure, efficient offline learning platform for everyone, everywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0b10] overflow-x-hidden`}>
        <AuthProvider>
          <UIProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 17, 23, 0.8)',
                  color: '#fff',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  fontWeight: 'bold',
                },
              }}
            />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
