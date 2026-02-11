"use client"


import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
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

export interface PlanConfig {
  name: string
  description: string
  price: string
  period: string
  highlighted?: boolean
  features: { text: string; included: boolean }[]
}

interface PricingCardProps {
  active?: boolean
  userEmail: string
  plan: PlanConfig
}



import { toast } from "sonner"

export function PricingCard({ active = false, userEmail, plan }: PricingCardProps) {
    const router = useRouter()
    const createCheckoutAction = useAction(createStripeCheckout, {
        onSuccess: async ({ data }) => {
            if(data?.url) {
                window.location.href = data.url
            }
        },
        onError: ({ error }) => {
            toast.error(error.serverError || "Ocorreu um erro ao iniciar a assinatura.")
        }
    })

    const handleCheckout = async () => {
        await createCheckoutAction.execute()
    }

    const handleManageSubscription = async () => {
        router.push(`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`)
    }
  return (
    <Card className="w-full max-w-xs rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          {active && (
            <Badge className="border-transparent bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
              Atual
            </Badge>
          )}
        </div>
        <CardDescription>
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-0 pb-0">
        <div className="flex items-baseline gap-1 pb-4">
          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
          <span className="text-base text-muted-foreground">/ {plan.period}</span>
        </div>

        <Separator />

        <div className="flex flex-col gap-3.5 py-6">
          {plan.features.map((feature) => (
            <div key={feature.text} className="flex items-center gap-3">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${feature.included ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span className={`text-sm ${feature.included ? 'text-muted-foreground' : 'text-muted-foreground/50 line-through'}`}>{feature.text}</span>
            </div>
          ))}
        </div>

        <Separator />
      </CardContent>

      <CardFooter className="pt-6">
       <Button
            variant="outline"
            className="w-full rounded-lg border-border bg-transparent text-foreground"
            onClick={active ? handleManageSubscription : handleCheckout}
            disabled={createCheckoutAction.isExecuting}
        >
        {createCheckoutAction.isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            active ? "Gerenciar Assinatura" : "Fazer Assinatura"
        )}
        </Button>
      </CardFooter>
    </Card>
  )
}
