"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initial = saved ?? (prefersDark ? "dark" : "light")
    setTheme(initial)
    document.documentElement.setAttribute("data-theme", initial)
  }, [])

  function toggle() {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
  }

  return (
    <button onClick={toggle} aria-label="Alternar tema"
      style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
      className="p-2 rounded-full transition-all hover:opacity-80 active:scale-95">
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
