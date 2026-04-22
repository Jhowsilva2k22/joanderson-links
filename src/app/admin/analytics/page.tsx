"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart2, MousePointerClick, Smartphone, Globe } from "lucide-react"
import type { Profile, Link as LinkRow, Click } from "@/lib/supabase/types"

interface ClickStat {
  link_id: string
  title: string
  url: string
  total: number
}

interface DayStat {
  date: string
  total: number
}

export default function AnalyticsPage() {
  const [linkStats, setLinkStats] = useState<ClickStat[]>([])
  const [dayStats, setDayStats] = useState<DayStat[]>([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [mobileRatio, setMobileRatio] = useState(0)
  const [topSource, setTopSource] = useState("-")
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      // select(*) evita problema de inferência TypeScript com seleção parcial
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single()

      if (!profileData) {
        setLoading(false)
        return
      }

      const profile = profileData as Profile

      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", profile.id)

      if (!linksData || linksData.length === 0) {
        setLoading(false)
        return
      }

      const links = linksData as LinkRow[]
      const linkIds = links.map((l) => l.id)

      const since = new Date()
      since.setDate(since.getDate() - 30)

      const { data: clicksRaw } = await supabase
        .from("clicks")
        .select("*")
        .in("link_id", linkIds)
        .gte("clicked_at", since.toISOString())

      if (!clicksRaw) {
        setLoading(false)
        return
      }

      // Cast explícito para evitar inferência never do Supabase TypeScript
      const clicks = clicksRaw as Click[]

      setTotalClicks(clicks.length)

      // Cliques por link
      const byLink: Record<string, number> = {}
      clicks.forEach((c) => {
        byLink[c.link_id] = (byLink[c.link_id] ?? 0) + 1
      })

      setLinkStats(
        links
          .map((l) => ({
            link_id: l.id,
            title: l.title,
            url: l.url,
            total: byLink[l.id] ?? 0,
          }))
          .sort((a, b) => b.total - a.total)
      )

      // Mobile vs desktop
      const mobileCount = clicks.filter((c) => c.device === "mobile").length
      setMobileRatio(
        clicks.length > 0
          ? Math.round((mobileCount / clicks.length) * 100)
          : 0
      )

      // Origem mais frequente
      const bySource: Record<string, number> = {}
      clicks.forEach((c) => {
        const s = c.source ?? "direto"
        bySource[s] = (bySource[s] ?? 0) + 1
      })
      const top = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0]
      setTopSource(top?.[0] ?? "-")

      // Cliques por dia (últimos 14 dias)
      const days: Record<string, number> = {}
      for (let i = 13; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days[
          d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        ] = 0
      }
      clicks.forEach((c) => {
        const d = new Date(c.clicked_at)
        const key = d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        })
        if (key in days) days[key]++
      })
      setDayStats(
        Object.entries(days).map(([date, total]) => ({ date, total }))
      )

      setLoading(false)
    }

    load()
  }, [])

  const maxDay = Math.max(...dayStats.map((d) => d.total), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Carregando...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Analytics
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Últimos 30 dias
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            icon: MousePointerClick,
            label: "Cliques totais",
            value: totalClicks.toString(),
          },
          { icon: Smartphone, label: "Via mobile", value: mobileRatio + "%" },
          { icon: Globe, label: "Origem top", value: topSource },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <Icon size={16} style={{ color: "var(--muted-foreground)" }} />
            <p
              className="text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {value}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Gráfico de barras */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} style={{ color: "var(--muted-foreground)" }} />
          <p
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Cliques por dia — últimos 14 dias
          </p>
        </div>
        <div className="flex items-end gap-1 h-24">
          {dayStats.map(({ date, total }) => (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(total / maxDay) * 100}%`,
                  minHeight: total > 0 ? "4px" : "1px",
                  background: "var(--primary)",
                  opacity: total > 0 ? 1 : 0.15,
                }}
              />
              <span
                className="text-[9px]"
                style={{ color: "var(--muted-foreground)" }}
              >
                {date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking de links */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Cliques por link
          </p>
        </div>
        {linkStats.length === 0 ? (
          <div
            className="px-4 py-8 text-center"
            style={{ background: "var(--card)" }}
          >
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Nenhum clique ainda.
            </p>
          </div>
        ) : (
          linkStats.map((stat, i) => {
            const pct =
              linkStats[0].total > 0
                ? (stat.total / linkStats[0].total) * 100
                : 0
            return (
              <div
                key={stat.link_id}
                className="px-4 py-3 border-b last:border-b-0 flex items-center gap-3"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <span
                  className="text-xs w-4 text-right flex-shrink-0"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--foreground)" }}
                  >
                    {stat.title}
                  </p>
                  <div
                    className="mt-1 h-1 rounded-full"
                    style={{ background: "var(--muted)" }}
                  >
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{ color: "var(--foreground)" }}
                >
                  {stat.total}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
