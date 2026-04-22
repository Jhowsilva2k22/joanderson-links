import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params

  // Sem generic <Database> — evita erros de inferência TypeScript
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data: link } = await supabase.from("links").select("*").eq("id", linkId).single()

  if (!link || !link.active) return NextResponse.redirect(new URL("/", request.url))

  const referrer = request.headers.get("referer") ?? ""
  const userAgent = request.headers.get("user-agent") ?? ""

  let source = "direto"
  if (referrer.includes("instagram")) source = "instagram"
  else if (referrer.includes("google")) source = "google"
  else if (referrer.includes("whatsapp")) source = "whatsapp"
  else if (referrer.includes("facebook")) source = "facebook"
  else if (referrer.includes("twitter") || referrer.includes("x.com")) source = "twitter"
  else if (referrer.includes("youtube")) source = "youtube"

  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent)

  // Fire-and-forget — não bloqueia o redirect
  supabase.from("clicks").insert({
    link_id: linkId,
    referrer: referrer || null,
    source,
    device: isMobile ? "mobile" : "desktop",
    country: request.headers.get("x-vercel-ip-country"),
    region: request.headers.get("x-vercel-ip-country-region"),
    user_agent: userAgent || null,
  }).then(() => {})

  return NextResponse.redirect(link.url)
}
