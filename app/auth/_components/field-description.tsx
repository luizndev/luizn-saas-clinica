import React from 'react'

import { FieldDescription } from '@/components/ui/field';

const FieldDescriptionComponent = () => {
  return (
    <FieldDescription className="px-6 text-center">
    Ao clicar em continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
    e <a href="#">Política de Privacidade</a>.
    </FieldDescription>
  )
}

export default FieldDescriptionComponent    