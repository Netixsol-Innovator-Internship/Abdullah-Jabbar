import "./globals.css";
import React from "react";
import SocketProvider from "../components/socket-provider";
import { AuthProvider } from "../components/auth-context";

export const metadata = { title: "Real-time Comments" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ overflowY: "scroll" }}>
        <AuthProvider>
          <SocketProvider>
            <div className="min-h-screen bg-gray-50">{children}</div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
