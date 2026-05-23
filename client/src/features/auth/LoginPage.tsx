import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Crown, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { login } from "./api";
import { useAuthStore } from "./authStore";

export function LoginPage() {
  const [email, setEmail] = useState("demo@luxora.dev");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      void queryClient.invalidateQueries();
      navigate((location.state as { from?: string } | null)?.from ?? "/products");
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof AxiosError
          ? mutationError.response?.data?.message ?? "Login failed"
          : "Login failed";
      setError(message);
    },
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    mutation.mutate({ email, password });
  };

  return (
    <section className="mx-auto grid max-w-6xl overflow-hidden rounded-md border border-luxora-gold/25 bg-white/90 shadow-luxora backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-[560px] overflow-hidden bg-luxora-ink">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-76"
          src="https://images.unsplash.com/photo-1506629905607-d9e297d63d30?auto=format&fit=crop&w=1500&q=85"
          alt="Luxury jewelry display"
        />
        <div className="absolute inset-0 bg-luxora-ink/42" />
        <div className="relative flex h-full min-h-[560px] flex-col justify-end p-8 text-white sm:p-10">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-md border border-luxora-gold/35 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-luxora-champagne backdrop-blur">
            <Sparkles size={14} />
            Member access
          </div>
          <h1 className="font-display text-6xl leading-none">Enter the maison.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/76">
            Your private cart, checkout, and order history are kept behind a polished member experience.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="p-6 sm:p-10">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-luxora-ink text-luxora-gold shadow-glow">
          <Crown size={22} />
        </div>
        <h2 className="mt-6 font-display text-5xl text-luxora-ink">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-luxora-ink/60">Use the demo credentials or sign in with a registered account.</p>
        <div className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <Input className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <Input
              className="mt-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </label>
          {error ? <p className="rounded-md bg-luxora-wine/10 px-3 py-2 text-sm text-luxora-wine">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            <LogIn size={18} />
            Sign in
          </Button>
        </div>
        <p className="mt-5 text-sm text-luxora-ink/60">
          New to LUXORA?{" "}
          <Link className="font-semibold text-luxora-ink underline decoration-luxora-gold decoration-2 underline-offset-4" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
}
