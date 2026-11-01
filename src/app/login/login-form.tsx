"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form
      action={action}
      className="space-y-4 rounded-xl bg-soft-paper p-5 shadow-subtle sm:p-6"
    >
      <input type="hidden" name="de" value={from} />
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          defaultValue={state?.email}
          placeholder="voce@exemplo.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <>
            Entrar <ArrowRight />
          </>
        )}
      </Button>
    </form>
  );
}
