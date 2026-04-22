import { createBrowserClient } from "@supabase/ssr"

// Sem generic <Database> — evita erros TypeScript 'never' nas operações de mutação.
// Tipos são aplicados via cast explícito nos arquivos que consomem os dados.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
