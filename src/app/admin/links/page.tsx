"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, X, Check } from "lucide-react"
import type { Link as LinkType } from "@/lib/supabase/types"

const CATEGORIES = [
  { value: "social", label: "Rede social" },
  { value: "product", label: "Produto" },
  { value: "service", label: "Serviço" },
  { value: "other", label: "Outro" },
]

interface LinkFormData { title: string; url: string; category: string }
const emptyForm: LinkFormData = { title: "", url: "", category: "social" }

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([])
  const [profile, setProfile] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<LinkFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()

  async function load() {
    const { data: profileData } = await supabase.from("profiles").select("id").limit(1).single()
    if (!profileData) { setLoading(false); return }
    setProfile(profileData)
    const { data: linksData } = await supabase.from("links").select("*").eq("profile_id", profileData.id).order("order_index", { ascending: true })
    setLinks(linksData ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setEditingId(null); setForm(emptyForm); setError(""); setShowForm(true) }
  function openEdit(link: LinkType) { setEditingId(link.id); setForm({ title: link.title, url: link.url, category: link.category }); setError(""); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditingId(null); setForm(emptyForm); setError("") }

  async function handleSave() {
    if (!form.title.trim() || !form.url.trim()) { setError("Preencha título e URL."); return }
    if (!profile) return
    setSaving(true); setError("")
    try {
      let url = form.url.trim()
      if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url
      if (editingId) {
        await supabase.from("links").update({ title: form.title.trim(), url, category: form.category }).eq("id", editingId)
      } else {
        await supabase.from("links").insert({ profile_id: profile.id, title: form.title.trim(), url, category: form.category, order_index: links.length, active: true })
      }
      await load(); closeForm()
    } finally { setSaving(false) }
  }

  async function toggleActive(link: LinkType) {
    await supabase.from("links").update({ active: !link.active }).eq("id", link.id)
    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, active: !l.active } : l)))
  }

  async function deleteLink(id: string) {
    if (!confirm("Excluir este link?")) return
    await supabase.from("links").delete().eq("id", id)
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-48"><p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Carregando...</p></div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Links</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{links.length} {links.length === 1 ? "link" : "links"} cadastrado{links.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.98]" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
          <Plus size={16} />Novo link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ border: "1px dashed var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Nenhum link cadastrado ainda.</p>
          <button onClick={openCreate} className="mt-3 text-sm font-medium underline underline-offset-2" style={{ color: "var(--foreground)" }}>Adicionar o primeiro</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", opacity: link.active ? 1 : 0.5 }}>
              <GripVertical size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{link.title}</p>
                <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>{link.url}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                {CATEGORIES.find((c) => c.value === link.category)?.label ?? link.category}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(link)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--muted-foreground)" }}>{link.active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <button onClick={() => openEdit(link)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--muted-foreground)" }}><Pencil size={16} /></button>
                <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded-lg hover:opacity-80" style={{ color: "var(--destructive)" }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold" style={{ color: "var(--foreground)" }}>{editingId ? "Editar link" : "Novo link"}</h2>
              <button onClick={closeForm} style={{ color: "var(--muted-foreground)" }}><X size={18} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Título</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="ex: Instagram"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>URL</label>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Categoria</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              {error && <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={closeForm} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-lg text-sm font-semibold active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                  {saving ? "Salvando..." : <><Check size={16} /> Salvar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
