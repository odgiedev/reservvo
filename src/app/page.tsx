import Link from "next/link";
import { PublicNavbar } from "@/components/features/PublicNavbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Agendamento simples para o seu negócio
          </h1>
          <p className="mx-auto max-w-xl text-base text-foreground/75 sm:text-lg">
            Gerencie recursos, horários e reservas em um só lugar. Seus clientes
            agendam online, você foca no que importa.
          </p>
          <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90 sm:w-auto"
            >
              Comece gratuitamente
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border-strong px-8 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Como funciona
            </Link>
          </div>
        </div>
      </section>      <section className="border-t border-border bg-muted px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            Tudo que você precisa para gerenciar agendamentos
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Agenda online
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Seus clientes escolhem o melhor horário diretamente na sua página
                de agendamento, sem necessidade de ligações ou mensagens.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Recursos flexíveis
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Crie quantos recursos precisar — salas, quadras, profissionais —
                cada um com suas próprias regras de disponibilidade.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Gestão de reservas
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Visualize todas as reservas, filtre por status e gerencie
                cancelamentos de forma rápida e organizada.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Disponibilidade personalizada
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Defina horários de atendimento por dia da semana para cada
                recurso. O sistema calcula os slots automaticamente.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Link público
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Compartilhe seu link personalizado e seus clientes agendam
                diretamente, sem necessidade de criar conta.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Dashboard completo
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                Acompanhe métricas, veja reservas recentes e tenha uma visão
                geral do seu negócio em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>      <section className="px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Pronto para simplificar seus agendamentos?
          </h2>
          <p className="text-foreground/75">
            Crie sua conta em segundos e comece a receber reservas hoje mesmo.
          </p>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-foreground/55">
            Reservvo &mdash; Plataforma de agendamento e reservas
          </p>
          <nav className="flex gap-6">
            <Link
              href="/how-it-works"
              className="text-sm text-foreground/55 transition-colors hover:text-foreground/75"
            >
              Como funciona
            </Link>
            <Link
              href="/about"
              className="text-sm text-foreground/55 transition-colors hover:text-foreground/75"
            >
              Sobre nós
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
