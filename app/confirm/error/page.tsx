import { XCircle } from 'lucide-react'
import Image from 'next/image'

export default function ConfirmErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-destructive/10 gap-5 p-4">
      <Image src="/agendafacil-red.svg" alt="Logo" width={280} height={280} />
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <XCircle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Link Inválido
        </h1>

        <p className="text-gray-600 mb-6 text-center leading-relaxed">
          O link de confirmação que você tentou acessar é inválido ou já foi utilizado.
        </p>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-destructive">
            <strong>O que fazer:</strong>
            <br />
            Se você acredita que isso é um erro, entre em contato diretamente com a clínica para confirmar seu agendamento.
          </p>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Você pode fechar esta página agora.
        </div>
      </div>
    </div>
  )
}
