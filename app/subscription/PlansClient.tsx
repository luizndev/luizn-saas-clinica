"use client"

import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import { toast } from "sonner"

import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { startFreeTrial } from "@/services/start-free-trial"

import { PricingCard } from "./_components/subscription-plan"
import { type PlanConfig } from "./_components/subscription-plan"

interface User {
  id: string
  email: string
  plan: string
  hasUsedTrial?: boolean | null
}

interface PlansClientProps {
  active?: boolean
  user: User
}

const essentialPlan: PlanConfig = {
  name: "Essential",
  description: "Para profissionais autonomos ou pequenas clinicas",
  price: "R$59",
  period: "mes",
  highlighted: true,
  features: [
    { text: "Cadastro de medicos ilimitados", included: true },
    { text: "Agendamentos ilimitados", included: true },
    { text: "Metricas basicas", included: true },
    { text: "Cadastro de pacientes", included: true },
    { text: "Confirmacao manual", included: true },
    { text: "Suporte via e-mail", included: true },
  ],
}

const benefits = [
  {
    icon: Clock,
    title: "Economize ate 10h por semana",
    description:
      "Automatize tarefas repetitivas e foque no que realmente importa: seus pacientes.",
  },
  {
    icon: Users,
    title: "Mais de 10+ clinicas confiam",
    description:
      "Profissionais de saude em todo o Brasil ja transformaram sua rotina com nossa plataforma.",
  },
  {
    icon: ShieldCheck,
    title: "Dados protegidos e seguros",
    description:
      "Seguranca de nivel hospitalar para as informacoes dos seus pacientes.",
  },
]

export default function PlansClient({ active = false, user }: PlansClientProps) {
  const [billingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  )

  const router = useRouter()
  const startTrialAction = useAction(startFreeTrial, {
    onSuccess: () => {
      toast.success("Teste gratis iniciado com sucesso!")
      router.push("/dashboard")
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Erro ao iniciar teste gratis")
    }
  })

  const currentPrice =
    billingCycle === "yearly"
      ? `R$${Math.round(59 * 0.8)}`
      : essentialPlan.price

  const showTrial = !user.hasUsedTrial && user.plan === "free"

  return (
    <div className="flex min-h-screen space-y-4 flex-col items-center bg-background px-4 py-12 md:py-20 relative">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      {/* Banner Bloqueio */}
      <Image src="/agendafacil-color.svg" alt="Banner Bloqueio" width={280} height={100} className="mb-10" />
      <div className="mb-10 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <Lock className="h-4 w-4 text-amber-700" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-amber-900">
            Voce precisa de um plano ativo para acessar a plataforma
          </p>
          <p className="text-xs leading-relaxed text-amber-700">
            Assine agora e comece a gerenciar sua clinica em menos de 2 minutos.
            Sem compromisso, cancele quando quiser.
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="flex max-w-2xl flex-col items-center gap-5 text-center">
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-primary/20 bg-accent px-3 py-1 text-accent-foreground"
        >
          <Zap className="h-3.5 w-3.5" />
          Oferta especial - Teste gratis por 14 dias
        </Badge>

        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Desbloqueie todo o potencial da sua clinica
        </h1>

        <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Pare de perder tempo com planilhas e agendas de papel. Tenha{" "}
          <span className="font-semibold text-foreground">
            controle total
          </span>{" "}
          dos seus agendamentos, pacientes e metricas em um so lugar.
        </p>
      </div>

      {/* Toggle Mensal / Anual */}
      {/* <div className="mt-10 flex items-center gap-1 rounded-full border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => setBillingCycle("monthly")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
            billingCycle === "monthly"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mensal
        </button>

        <button
          type="button"
          onClick={() => setBillingCycle("yearly")}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
            billingCycle === "yearly"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Anual
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-primary ${billingCycle === "yearly" ? "bg-primary-foreground text-primary" : "bg-primary/10 text-primary"}`}>
            -20%
          </span>
        </button>
      </div> */}

      {/* Cards de Plano */}
      <div className="mt-12 flex w-full max-w-4xl flex-col items-center justify-center gap-8 md:flex-row md:items-stretch">
        {showTrial && (
           <Card className="w-full max-w-sm rounded-2xl border-2 border-primary/20 bg-accent/5 shadow-lg">
           <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
               <CardTitle className="text-2xl font-bold text-primary">Teste Gratis</CardTitle>
               <Badge className="bg-primary text-primary-foreground">
                 14 DIAS
               </Badge>
             </div>
             <CardDescription>
               Experimente todos os recursos do plano Essential sem pagar nada por 14 dias.
             </CardDescription>
           </CardHeader>
   
           <CardContent className="flex flex-col gap-0 pb-0">
             <div className="flex items-baseline gap-1 pb-4">
               <span className="text-3xl font-bold text-foreground">R$0</span>
               <span className="text-base text-muted-foreground">/ 14 dias</span>
             </div>
   
             <Separator />
   
             <div className="flex flex-col gap-3.5 py-6">
               {essentialPlan.features.map((feature) => (
                 <div key={feature.text} className="flex items-center gap-3">
                   <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                     <Check className="h-3 w-3" strokeWidth={3} />
                   </div>
                   <span className="text-sm text-muted-foreground">{feature.text}</span>
                 </div>
               ))}
             </div>
   
             <Separator />
           </CardContent>
   
           <CardFooter className="pt-6">
            <Button
                 className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                 onClick={() => startTrialAction.execute()}
                 disabled={startTrialAction.isPending}
             >
             {startTrialAction.isPending ? (
                 <Loader2 className="h-4 w-4 animate-spin" />
             ) : (
                 "Iniciar Teste Gratis"
             )}
             </Button>
           </CardFooter>
         </Card>
        )}

        <PricingCard
          plan={{ ...essentialPlan, price: currentPrice }}
          active={active}
          userEmail={user.email}
        />
      </div>

      {/* Garantias */}
      <div className="mt-8 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4 text-primary" />
            14 dias gratis
          </span>

          <span className="h-1 w-1 rounded-full bg-border" />

          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Cancele a qualquer momento
          </span>

          <span className="h-1 w-1 rounded-full bg-border" />

          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-primary" />
            Sem taxas escondidas
          </span>
        </div>
      </div>

      {/* Beneficios */}
      <div className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
              <benefit.icon className="h-5 w-5 text-primary" />
            </div>

            <h3 className="text-sm font-semibold text-foreground">
              {benefit.title}
            </h3>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Final */}
      <div className="mt-14 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Ainda tem duvidas?{" "}
          <button
            type="button"
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition-colors hover:underline"
          >
            Fale com nosso time
            <ArrowRight className="h-3 w-3" />
          </button>
        </p>
      </div>
    </div>
  )
}
