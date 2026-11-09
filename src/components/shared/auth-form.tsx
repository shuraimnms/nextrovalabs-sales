"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import type { FormState } from "@/app/actions-auth";

export type Field = { name: string; label: string; type?: string; autoComplete?: string; hidden?: boolean; value?: string };

export function AuthForm({ action, fields, submit, hint }: { action: (s: FormState, f: FormData) => Promise<FormState>; fields: Field[]; submit: string; hint?: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-4" noValidate>
      {fields.map((f) =>
        f.hidden ? (
          <input key={f.name} type="hidden" name={f.name} value={f.value ?? ""} />
        ) : (
          <div key={f.name}>
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input id={f.name} name={f.name} type={f.type ?? "text"} autoComplete={f.autoComplete} required aria-describedby={state?.error ? "form-error" : undefined} />
          </div>
        ),
      )}
      <FieldError id="form-error">{state?.error}</FieldError>
      {state?.success && <p role="status" className="rounded-lg bg-success-bg p-3 text-sm text-success">{state.success}</p>}
      <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 className="animate-spin" aria-hidden />}{pending ? "Please wait…" : submit}</Button>
      {hint}
    </form>
  );
}
