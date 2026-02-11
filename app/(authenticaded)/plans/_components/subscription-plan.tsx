"use client"


import { Check, Loader2 } from "lucide-react"
import { useAction } from "next-safe-action/hooks"

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
import { createStripeCheckout } from "@/services/create-stripe-checkout"

interface PricingCardProps {
  active?: boolean
}

const features = [
  "Cadastro de até 3 médicos",
  "Agendamentos ilimitados",
  "Métricas básicas",
  "Cadastro de pacientes",
  "Confirmação manual",
  "Suporte via e-mail",
]

export function PricingCard({ active = false }: PricingCardProps) {
    const createCheckoutAction = useAction(createStripeCheckout, {
        onSuccess: async ({ data }) => {
            if(data?.url) {
                window.location.href = data.url
            }
        },
    })

    const handleCheckout = async () => {
        await createCheckoutAction.execute()
    }
  return (
    <Card className="w-full max-w-xs rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Essential</CardTitle>
          {active && (
            <Badge className="border-transparent bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
              Atual
            </Badge>
          )}
        </div>
        <CardDescription>
          Para profissionais autônomos ou pequenas clínicas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-0 pb-0">
        <div className="flex items-baseline gap-1 pb-4">
          <span className="text-3xl font-bold text-foreground">R$59</span>
          <span className="text-base text-muted-foreground">/ mês</span>
        </div>

        <Separator />

        <div className="flex flex-col gap-3.5 py-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Separator />
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          variant="outline"
          className="w-full rounded-lg border-border bg-transparent text-foreground"
          onClick={active ? () => {} : handleCheckout}
        >
            {createCheckoutAction.isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {active ? "Gerenciar Assinatura" : "Fazer Assinatura"}
        </Button>
      </CardFooter>
    </Card>
  )
}
