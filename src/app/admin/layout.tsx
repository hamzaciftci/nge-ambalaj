import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySession();

  // Login sayfası için layout'u atla
  const isLoginPage = false; // Bu server component'te path'i okuyamayız

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
