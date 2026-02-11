"use client"

import { BookDashed, Check, CreditCard, LayoutDashboard, Loader2, Shield, Sparkles } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const steps = [
  {
    id: 1,
    label: "Verificando pagamento",
    description: "Confirmando os dados do seu pagamento",
    icon: CreditCard,
  },
  {
    id: 2,
    label: "Ativando assinatura",
    description: "Configurando seu plano e benefícios",
    icon: Shield,
  },
  {
    id: 3,
    label: "Preparando seu acesso",
    description: "Liberando todas as funcionalidades",
    icon: Sparkles,
  },
]

export default function SubscriptionProcessing() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 60)

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    if (progress >= 30 && currentStep === 0) {
      setCurrentStep(1)
    } else if (progress >= 65 && currentStep === 1) {
      setCurrentStep(2)
    } else if (progress >= 100 && currentStep === 2) {
      setTimeout(() => {
        setCurrentStep(steps.length) // força todos como concluídos
        setIsComplete(true)
      }, 400)
    }
  }, [progress, currentStep])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full flex flex-col items-center justify-center max-w-lg">
        <Image src="/agendafacil-color.svg" alt="Banner Bloqueio" width={280} height={100} className="mb-10" />
        {/* Animated glow effect behind card */}
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl opacity-20 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            }}
          />

          <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl">
            {/* Top accent line */}
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                {isComplete ? (
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary animate-in zoom-in duration-500">
                      <Check className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                <h1 className="mb-2 text-balance text-2xl font-semibold tracking-tight text-foreground">
                  {isComplete
                    ? "Assinatura ativada!"
                    : "Estamos processando seu pedido!"}
                </h1>
                <p className="text-pretty text-sm text-muted-foreground">
                  {isComplete
                    ? "Tudo pronto! Você já pode acessar o dashboard."
                    : "Aguarde alguns segundos enquanto preparamos tudo para você."}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Progresso
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-primary">
                    {Math.min(progress, 100)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-secondary" />
              </div>

              {/* Steps */}
              <div className="mb-8 space-y-3">
                {steps.map((step, index) => {
                  const isActive = index === currentStep
                  const isDone = index < currentStep || isComplete
                  const StepIcon = step.icon

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-500 ${
                        isActive
                          ? "border-primary/30 bg-primary/5"
                          : isDone
                            ? "border-primary/20 bg-primary/5"
                            : "border-border/30 bg-secondary/30"
                      }`}
                    >
                      {/* Step indicator */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-4 w-4" />
                        ) : isActive ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>

                      {/* Step text */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium transition-colors duration-300 ${
                            isDone || isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Status */}
                      {isDone && (
                        <span className="shrink-0 text-xs font-medium text-primary animate-in fade-in slide-in-from-right-2 duration-300">
                          Concluído
                        </span>
                      )}
                      {isActive && (
                        <span className="shrink-0 text-xs font-medium text-muted-foreground animate-pulse">
                          Processando...
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* CTA Button */}
              <Button
                className="w-full text-sm font-semibold transition-all duration-300"
                size="lg"
                disabled={!isComplete}
                onClick={() => (window.location.href = "/dashboard")}
              >
                {isComplete ? (
                  <>
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    Ir para o Dashboard
                  </>
                ) : (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aguardando...
                  </>
                )}
              </Button>

              {/* Security note */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Transação segura e criptografada
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
