import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/AdminSidebar"

export const metadata = { title: "Admin — Joanderson Links" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div style={{ background: "var(--background)", minHeight: "100vh" }}>{children}</div>
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  )
}
