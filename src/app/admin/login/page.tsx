"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError("Email ou senha incorretos."); setLoading(false); return }
    router.push("/admin/links")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Painel Admin</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Acesso restrito.</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          </div>
          {error && <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
