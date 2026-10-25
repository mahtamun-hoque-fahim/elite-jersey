"use client";

import { startTransition, useActionState, type FormEvent } from "react";

/**
 * Like `<form action={...}>` with useActionState, but the form is NOT reset after the action runs,
 * so what the person typed survives a validation error. Native `required` checks still run first.
 */
export function useActionForm<S>(action: (prev: Awaited<S> | undefined, formData: FormData) => Promise<S>) {
  const [state, run, pending] = useActionState(action, undefined);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => run(data));
  }
  return { state, onSubmit, pending };
}
