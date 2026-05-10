import Link from "next/link";
import type { Metadata } from "next";
import { PublicNavbar } from "@/components/features/PublicNavbar";

export const metadata: Metadata = {
  title: "Como funciona — Reservvo",
  description:
    "Entenda como o Reservvo conecta prestadores de serviço e clientes em poucos passos.",
};

interface Step {
  number: string;
  title: string;
  description: string;
}

const providerSteps: Step[] = [
  {
    number: "01",
    title: "Crie sua conta como prestador",
    description:
      "Cadastre-se em segundos escolhendo o papel de Prestador (ou Ambos, se também quiser reservar).",
  },
  {
    number: "02",
    title: "Configure seu perfil de negócio",
    description:
      "Defina nome, slug público (URL), descrição e telefone de contato. Esse perfil será exibido aos clientes.",
  },
  {
    number: "03",
    title: "Cadastre seus recursos",
    description:
      "Crie quantos recursos quiser — salas, quadras, profissionais, equipamentos. Cada recurso tem sua própria duração de slot.",
  },
  {
    number: "04",
    title: "Defina disponibilidade",
    description:
      "Configure horários de atendimento por dia da semana para cada recurso. O sistema calcula os slots automaticamente.",
  },
  {
    number: "05",
    title: "Compartilhe seu link público",
    description:
      "Divulgue sua URL personalizada (ex: reservvo.com/booking/seu-negocio) para receber reservas online.",
  },
  {
    number: "06",
    title: "Gerencie reservas",
    description:
      "Acompanhe reservas pelo dashboard, filtre por status e cancele quando necessário.",
  },
];

const clientSteps: Step[] = [
  {
    number: "01",
    title: "Crie sua conta como cliente",
    description:
      "Cadastro rápido. Você fornece nome, e-mail e telefone para o prestador entrar em contato se necessário.",
  },
  {
    number: "02",
    title: "Acesse o link do prestador",
    description:
      "Receba a URL pública do prestador (compartilhada por ele) e veja todos os recursos disponíveis.",
  },
  {
    number: "03",
    title: "Escolha recurso e horário",
    description:
      "Selecione o recurso, a data desejada e um dos horários livres. O sistema bloqueia automaticamente slots ocupados.",
  },
  {
    number: "04",
    title: "Confirme a reserva",
    description:
      "Adicione observações (opcional) e confirme. A reserva entra como CONFIRMED imediatamente.",
  },
  {
    number: "05",
    title: "Acompanhe suas reservas",
    description:
      "Veja todas as suas reservas em um só lugar. Cancele com um clique caso precise reagendar.",
  },
];

const StepCard = ({ step }: { step: Step }) => (
  <div className="flex gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
    <div className="shrink-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
        {step.number}
      </div>
    </div>
    <div className="space-y-1.5">
      <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
      <p className="text-sm leading-relaxed text-foreground/75">
        {step.description}
      </p>
    </div>
  </div>
);

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicNavbar />      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Como funciona o Reservvo
          </h1>
          <p className="mx-auto max-w-xl text-base text-foreground/75 sm:text-lg">
            Dois fluxos simples — um para prestadores que oferecem serviços,
            outro para clientes que querem reservar.
          </p>
        </div>
      </section>      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-3">
            <span className="inline-flex h-8 items-center rounded-full bg-foreground px-3 text-xs font-semibold uppercase tracking-wider text-background">
              Para prestadores
            </span>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Comece a receber reservas
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {providerSteps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>      <div className="mx-auto h-px w-full max-w-5xl bg-border" />      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-3">
            <span className="inline-flex h-8 items-center rounded-full border border-border-strong px-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Para clientes
            </span>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              Reserve em minutos
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {clientSteps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </section>      <section className="border-t border-border bg-muted px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            O fluxo completo em uma imagem
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Prestador cria recursos
              </h3>
              <p className="text-sm text-foreground/75">
                Cadastra serviços e configura disponibilidade
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Compartilha link
              </h3>
              <p className="text-sm text-foreground/75">
                URL pública vira canal de reservas
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                Cliente agenda
              </h3>
              <p className="text-sm text-foreground/75">
                Escolhe horário e confirma. Pronto.
              </p>
            </div>
          </div>
        </div>
      </section>      <section className="px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Pronto para começar?
          </h2>
          <p className="text-foreground/75">
            Crie sua conta gratuita e escolha como quer atuar — prestador,
            cliente ou ambos.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90 sm:w-auto"
            >
              Criar conta gratuita
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-border-strong px-8 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Sobre nós
            </Link>
          </div>
        </div>
      </section>      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-foreground/55">
            Reservvo &mdash; Plataforma de agendamento e reservas
          </p>
          <nav className="flex gap-6">
            <Link
              href="/about"
              className="text-sm text-foreground/55 transition-colors hover:text-foreground/75"
            >
              Sobre nós
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-foreground/55 transition-colors hover:text-foreground/75"
            >
              Como funciona
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
