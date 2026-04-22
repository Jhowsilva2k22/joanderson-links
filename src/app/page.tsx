import { createClient } from "@/lib/supabase/server"
import { ThemeToggle } from "@/components/ThemeToggle"
import Image from "next/image"
import type { Metadata } from "next"
import type { Profile } from "@/lib/supabase/types"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single()
  const profile = data as Profile | null
  return {
    title: profile?.name ?? "Link in Bio",
    description: profile?.bio ?? "",
  }
}

export default async function PublicPage() {
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single()

  const profile = profileData as Profile | null

  const { data: linksData } = await supabase
    .from("links")
    .select("*")
    .eq("active", true)
    .order("order_index", { ascending: true })

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Perfil não configurado.</p>
      </div>
    )
  }

  const links = (linksData ?? []) as import("@/lib/supabase/types").Link[]
  const socialLinks = links.filter((l) => l.category === "social")
  const productLinks = links.filter((l) => l.category !== "social")

  // Cor de destaque — usada nos botões e avatar
  const accentColor = profile.primary_color || "#0a0a0a"
  // Texto sobre o botão de destaque
  const accentTextColor = profile.secondary_color || "#ffffff"

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Foto de capa */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        {profile.cover_url ? (
          <Image
            src={profile.cover_url}
            alt="Foto de capa"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: accentColor }}
          />
        )}
        {/* Gradiente fade — usa variável CSS para respeitar dark mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col items-center px-4 -mt-16 pb-16 max-w-sm mx-auto w-full">
        {/* Avatar */}
        <div className="relative mb-4">
          {profile.avatar_url ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 rounded-full border-4 border-background shadow-lg flex items-center justify-center text-2xl font-bold"
              style={{ background: accentColor, color: accentTextColor }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Nome e bio */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1
            className="text-xl font-bold mb-2 text-foreground"
            style={{ fontFamily: profile.font_family || "Inter" }}
          >
            {profile.name}
          </h1>
          {profile.bio && (
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Redes sociais */}
        {socialLinks.length > 0 && (
          <div className="w-full flex flex-col gap-3 mb-6">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={`/api/click/${link.id}`}
                className="animate-fade-in-up w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                style={{ background: accentColor, color: accentTextColor }}
              >
                {link.icon_url && (
                  <Image src={link.icon_url} alt="" width={20} height={20} className="rounded" />
                )}
                <span className="flex-1 text-center">{link.title}</span>
              </a>
            ))}
          </div>
        )}

        {/* Produtos e serviços */}
        {productLinks.length > 0 && (
          <>
            <div className="w-full mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Produtos e serviços
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              {productLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/api/click/${link.id}`}
                  className="animate-fade-in-up w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all hover:opacity-80 active:scale-[0.98] bg-card text-card-foreground border border-border"
                >
                  {link.icon_url ? (
                    <Image src={link.icon_url} alt="" width={20} height={20} className="rounded" />
                  ) : (
                    <div
                      className="w-5 h-5 rounded flex-shrink-0"
                      style={{ background: accentColor }}
                    />
                  )}
                  <span className="flex-1 text-center">{link.title}</span>
                </a>
              ))}
            </div>
          </>
        )}

        {links.length === 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Nenhum link cadastrado ainda.
          </p>
        )}

        <p className="mt-12 text-xs text-muted-foreground">joandersonsilva.com.br</p>
      </div>
    </main>
  )
}
