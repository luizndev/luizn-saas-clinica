import { ArrowRight, Calendar, Check, Clock, FileText, LayoutDashboard, Mail, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/auth'

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/agendafacil-color.svg" alt="AgendaFácil" width={180} height={40} />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className="text-gray-600 hover:text-primary transition">Benefícios</a>
            <a href="#planos" className="text-gray-600 hover:text-primary transition">Planos</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-primary transition">Depoimentos</a>
            {session ? (
              <Link href="/dashboard">
                <Button variant="outline"><LayoutDashboard />Ir para Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline">Entrar</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme a gestão da sua clínica <span className="text-primary">em minutos</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            A solução completa para agendamentos, gestão de pacientes e métricas que realmente importam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 py-6">
                Começar Já
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Demonstração
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✓ Sem cartão de crédito necessário  ✓ Configuração em 5 minutos
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para gerenciar sua clínica
            </h2>
            <p className="text-xl text-gray-600">
              Ferramentas simples e poderosas para o dia a dia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Agendamento Ilimitado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Agende quantas consultas precisar, sem limites ou taxas extras
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Cadastro de Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mantenha todos os dados dos seus pacientes organizados e seguros
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Confirmação Automática</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Envie confirmações por e-mail e SMS automaticamente
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Métricas Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe o desempenho da sua clínica com relatórios claros
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Exportação de Dados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Exporte seus dados em CSV ou relatórios personalizados
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Suporte Dedicado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nossa equipe está pronta para ajudar quando você precisar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 bg-linear-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos que crescem com você
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para sua clínica
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Plano Essencial */}
            <Card className="border-2 hover:border-primary transition">
              <CardHeader>
                <CardTitle className="text-2xl">Essencial</CardTitle>
                <CardDescription>Perfeito para começar</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 59</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>1 clínica</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Até 3 médicos</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Agendamentos ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Pacientes ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Métricas básicas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Confirmação manual</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Suporte via e-mail</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Exportação CSV</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/auth" className="w-full">
                  <Button className="w-full" size="lg" variant="outline">
                    Escolher Plano
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Plano Professional */}
            <Card className="border-2 border-primary shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Professional</CardTitle>
                <CardDescription>Para clínicas em crescimento</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 129</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Até 3 clínicas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Médicos ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Agendamentos ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Pacientes ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Métricas avançadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Confirmação automática (E-mail + SMS)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Suporte prioritário</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Relatórios personalizados</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/auth" className="w-full">
                  <Button className="w-full" size="lg">
                    Escolher Plano
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Plano Enterprise */}
            <Card className="border-2 border-purple-500 shadow-xl relative bg-linear-to-br from-purple-50 to-white">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Completo
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>Solução completa e escalável</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 299</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Clínicas ilimitadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Médicos ilimitados</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Tudo do Professional +</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Integrações com sistemas externos</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">API personalizada</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">White-label (sua marca)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Gerente de conta dedicado</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Suporte 24/7</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/auth" className="w-full">
                  <Button className="w-full bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600" size="lg">
                    Falar com Vendas
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Clínicas que confiam no AgendaFácil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">DS</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dra. Sofia Mendes</CardTitle>
                    <CardDescription>Clínica Vida Saudável</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "O AgendaFácil transformou a forma como gerenciamos nossa clínica. Economizamos horas toda semana!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">RC</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dr. Roberto Costa</CardTitle>
                    <CardDescription>Clínica Bem Estar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Interface simples e intuitiva. Minha equipe aprendeu a usar em minutos. Recomendo!"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">MA</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">Dra. Mariana Alves</CardTitle>
                    <CardDescription>Clínica Saúde Total</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "As confirmações automáticas reduziram drasticamente as faltas. Excelente investimento!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-linear-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para organizar sua clínica?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Economize tempo, organize melhor e foque no que realmente importa: seus pacientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Comece Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            Junte-se a centenas de clínicas que já confiam no AgendaFácil
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-gray-600 mb-6">
              Receba dicas, atualizações e conteúdo exclusivo sobre gestão de clínicas
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1"
              />
              <Button type="submit" size="lg">
                Inscrever-se
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/agendafacil-white.svg" alt="AgendaFácil" width={180} height={32} />
              </div>
              <p className="text-sm">
                Organize sua clínica de forma simples e eficiente
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#beneficios" className="hover:text-white transition">Benefícios</a></li>
                <li><a href="#planos" className="hover:text-white transition">Planos</a></li>
                <li><a href="#" className="hover:text-white transition">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 AgendaFácil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
