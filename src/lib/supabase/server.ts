import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Sem generic <Database> — evita erros TypeScript 'never' nas operações de mutação.
// Tipos são aplicados via cast explícito nos arquivos que consomem os dados.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — middleware cuida do refresh da sessão.
          }
        },
      },
    }
  )
}
