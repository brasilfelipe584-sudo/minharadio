import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/flashmix/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Apenas ADMIN pode acessar
  if ((session.user as any).role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
