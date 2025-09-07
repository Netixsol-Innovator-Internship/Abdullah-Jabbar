import type React from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AdminGuard } from "@/components/AdminGuard";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard
      fallback={
        <div className="p-8 text-sm text-gray-500">Checking permissions...</div>
      }
    >
      <DashboardLayout>{children}</DashboardLayout>
    </AdminGuard>
  );
}
