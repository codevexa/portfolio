"use client"

import { signIn } from "../actions"
import { FormMessage, SubmitButton, useFormAction } from "@/components/admin/ui"

export function LoginForm() {
  const { state, onSubmit, pending } = useFormAction(signIn)
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending} className="btn btn-primary w-full">Entrar</SubmitButton>
    </form>
  )
}
