"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [mode, setMode] = useState<"password" | "magic">("password")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email ou senha incorretos.")
      setLoading(false)
      return
    }
    window.location.href = "/admin"
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    if (error) setError("Erro ao enviar o link. Tenta novamente.")
    else setMessage("Link enviado para seu email. Clica nele para entrar.")
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-lg font-bold text-foreground mb-1">Painel Admin</h1>
        <p className="text-sm text-muted-foreground mb-6">Acesso restrito.</p>

        {mode === "password" ? (
          <form onSubmit={handlePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("magic"); setError(""); setMessage("") }}
              className="text-xs text-muted-foreground hover:text-foreground transition text-center"
            >
              Esqueci minha senha / Primeiro acesso
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Digite seu email e enviaremos um link de acesso direto.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {message && <p className="text-xs text-green-600">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-sm font-medium bg-foreground text-background hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar link de acesso"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("password"); setError(""); setMessage("") }}
              className="text-xs text-muted-foreground hover:text-foreground transition text-center"
            >
              Voltar para login com senha
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
