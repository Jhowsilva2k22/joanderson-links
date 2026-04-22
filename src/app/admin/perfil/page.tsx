"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Save } from "lucide-react"
import type { Profile } from "@/lib/supabase/types"

const FONTS = ["Inter","Roboto","Poppins","Playfair Display","Montserrat","Raleway","Lato","Nunito","DM Sans","Space Grotesk"]

type FormData = Pick<Profile, "name" | "bio" | "primary_color" | "secondary_color" | "bg_color" | "font_family">

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<FormData>({ name: "", bio: "", primary_color: "#0a0a0a", secondary_color: "#ffffff", bg_color: "#f5f5f5", font_family: "Inter" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").limit(1).single()
      if (data) { setProfile(data); setForm({ name: data.name, bio: data.bio, primary_color: data.primary_color, secondary_color: data.secondary_color, bg_color: data.bg_color, font_family: data.font_family }) }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    if (!profile) return
    setSaving(true); setSuccess(false)
    await supabase.from("profiles").update(form).eq("id", profile.id)
    setSaving(false); setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Carregando...</p></div>

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Perfil</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Edite nome, frase e aparência da sua página.</p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Nome de exibição</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Frase de posicionamento</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Fonte</label>
          <select value={form.font_family} onChange={(e) => setForm({ ...form, font_family: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)", fontFamily: form.font_family }}>
            {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
          <p className="text-sm mt-1 p-2 rounded-lg" style={{ fontFamily: form.font_family, color: "var(--muted-foreground)", background: "var(--muted)" }}>Prévia: Pai presente. Reconstrução diária.</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Cores</p>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Principal", key: "primary_color" as const }, { label: "Secundária", key: "secondary_color" as const }, { label: "Fundo", key: "bg_color" as const }].map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-1 items-center">
                <label className="text-xs" style={{ color: "var(--muted-foreground)" }}>{label}</label>
                <input type="color" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" style={{ border: "1px solid var(--border)" }} />
                <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{form[key]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: form.bg_color, border: "1px solid var(--border)" }}>
          <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-base font-bold" style={{ background: form.primary_color, color: form.secondary_color }}>{form.name.charAt(0).toUpperCase() || "J"}</div>
          <p className="text-sm font-bold" style={{ color: form.primary_color, fontFamily: form.font_family }}>{form.name || "Seu nome"}</p>
          <p className="text-xs mt-0.5" style={{ color: form.secondary_color }}>{form.bio || "Sua frase de posicionamento"}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Save size={16} />{saving ? "Salvando..." : success ? "Salvo!" : "Salvar alterações"}
        </button>
      </div>
    </div>
  )
}
