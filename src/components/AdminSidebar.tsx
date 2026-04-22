"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Link2, User, BarChart2, LogOut } from "lucide-react"

const navItems = [
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/perfil", label: "Perfil", icon: User },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col min-h-screen sticky top-0" style={{ background: "var(--card)", borderRight: "1px solid var(--border)" }}>
      <div className="px-5 py-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <LayoutDashboard size={16} style={{ color: "var(--muted-foreground)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>Joanderson Links</span>
        </div>
        <p className="text-xs mt-1 truncate" style={{ color: "var(--muted-foreground)" }}>{userEmail}</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: active ? "var(--muted)" : "transparent", color: active ? "var(--foreground)" : "var(--muted-foreground)" }}>
              <Icon size={16} />{label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full hover:opacity-80" style={{ color: "var(--muted-foreground)" }}>
          <LogOut size={16} />Sair
        </button>
      </div>
    </aside>
  )
}
