import { useMutation } from "@tanstack/react-query";
import { Crown, Gem, UserPlus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { parseApiError, type ParsedApiError } from "../../shared/lib/apiError";
import { register } from "./api";
import { useAuthStore } from "./authStore";

export function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<ParsedApiError | null>(null);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      setSession(session);
      navigate("/products");
    },
    onError: (mutationError) => {
      setError(parseApiError(mutationError, "Registration failed. Please try again."));
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    mutation.mutate(form);
  };

  return (
    <section className="mx-auto grid max-w-6xl overflow-hidden rounded-md border border-luxora-gold/25 bg-white/90 shadow-luxora backdrop-blur lg:grid-cols-[0.92fr_1.08fr]">
      <div className="relative min-h-[560px] bg-luxora-ink">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-72"
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1500&q=85"
          alt="Premium ring detail"
        />
        <div className="absolute inset-0 bg-luxora-ink/45" />
        <div className="relative flex h-full min-h-[560px] flex-col justify-end p-8 text-white sm:p-10">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-md border border-luxora-gold/40 bg-white/10 text-luxora-champagne backdrop-blur">
            <Gem size={22} />
          </div>
          <h1 className="font-display text-6xl leading-none">Create your private account.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/76">Registration is open from the top navigation and from here, with instant cart and checkout access.</p>
        </div>
      </div>
      <div className="p-6 sm:p-10">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-luxora-ink text-luxora-gold shadow-glow">
          <Crown size={22} />
        </div>
        <h2 className="mt-6 font-display text-5xl text-luxora-ink">Join LUXORA</h2>
        <p className="mt-2 text-sm leading-6 text-luxora-ink/60">Create an account for persistent cart, checkout, and order history.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          First name
          <Input
            className="mt-2"
            value={form.firstName}
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium">
          Last name
          <Input
            className="mt-2"
            value={form.lastName}
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Email
          <Input
            className="mt-2"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Password
          <Input
            className="mt-2"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </label>
        {error ? (
          <div className="rounded-md border border-luxora-wine/20 bg-luxora-wine/10 px-3 py-3 text-sm text-luxora-wine sm:col-span-2">
            <p className="font-semibold">{error.message}</p>
            {error.details.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {error.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <Button className="sm:col-span-2" type="submit" disabled={mutation.isPending}>
          <UserPlus size={18} />
          Create account
        </Button>
      </form>
      <p className="mt-5 text-sm text-luxora-ink/60">
        Already registered?{" "}
        <Link className="font-semibold text-luxora-ink underline decoration-luxora-gold decoration-2 underline-offset-4" to="/login">
          Sign in
        </Link>
      </p>
      </div>
    </section>
  );
}
