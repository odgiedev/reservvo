import Link from "next/link";
import type { Metadata } from "next";
import { PublicNavbar } from "@/components/features/PublicNavbar";

export const metadata: Metadata = {
  title: "Sobre nós — Reservvo",
  description: "Conheça o Reservvo, a plataforma de agendamento e reservas.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />      <section className="px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Sobre o Reservvo
          </h1>
          <p className="mx-auto max-w-xl text-base text-foreground/75 sm:text-lg">
            Uma plataforma criada para simplificar o agendamento de serviços e
            recursos de forma prática e eficiente.
          </p>
        </div>
      </section>      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Nossa missão
            </h2>
            <p className="leading-relaxed text-foreground/80">
              O Reservvo nasceu da necessidade de tornar o processo de
              agendamento mais simples — tanto para quem oferece serviços quanto
              para quem precisa reservar um horário. Acreditamos que gerenciar
              reservas não deveria ser complicado, e criamos uma ferramenta que
              elimina a fricção entre prestadores e clientes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              O que fazemos
            </h2>
            <p className="leading-relaxed text-foreground/80">
              Oferecemos uma plataforma completa para profissionais e empresas
              que precisam gerenciar agendamentos. Com o Reservvo, você cria
              seus recursos (salas, quadras, profissionais), define horários de
              disponibilidade e compartilha um link público para seus clientes
              agendarem diretamente — sem ligações, sem mensagens, sem
              complicação.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Para quem é o Reservvo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-5 space-y-2">
                <h3 className="font-semibold text-foreground">Prestadores de serviço</h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  Profissionais autônomos, clínicas, estúdios, academias e
                  qualquer negócio que precise organizar sua agenda e receber
                  reservas online.
                </p>
              </div>
              <div className="rounded-xl border border-border p-5 space-y-2">
                <h3 className="font-semibold text-foreground">Clientes</h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  Pessoas que desejam agendar serviços de forma rápida,
                  escolhendo o melhor horário disponível sem precisar criar
                  conta.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Nossos valores
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground/30" />
                <div>
                  <span className="font-medium text-foreground">Simplicidade</span>
                  <span className="text-foreground/75"> — interfaces limpas e fluxos diretos, sem complexidade desnecessária.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground/30" />
                <div>
                  <span className="font-medium text-foreground">Acessibilidade</span>
                  <span className="text-foreground/75"> — funciona em qualquer dispositivo, para qualquer pessoa.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground/30" />
                <div>
                  <span className="font-medium text-foreground">Confiabilidade</span>
                  <span className="text-foreground/75"> — seus agendamentos sempre disponíveis, seus dados sempre seguros.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>      <section className="border-t border-border bg-foreground/[0.02] px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Experimente o Reservvo
          </h2>
          <p className="text-foreground/75">
            Crie sua conta gratuitamente e comece a receber agendamentos hoje.
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
