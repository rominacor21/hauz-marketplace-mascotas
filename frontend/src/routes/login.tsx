import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginByEmail } from "@backend/functions/profiles.functions";
import { setUserId } from "@/lib/session";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Hauz" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Ingresá tu email.");
      return;
    }
    setLoading(true);
    const result = await loginByEmail({ data: { email: email.trim().toLowerCase() } });
    setLoading(false);
    if ("error" in result) {
      setError("No encontramos una cuenta con ese email.");
      return;
    }
    setUserId(result.id);
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app py-8">
        <div className="mb-8 flex justify-center">
          <Logo size={40} withWordmark />
        </div>
        <h1 className="mb-1 text-2xl font-extrabold">Entrar a Hauz</h1>
        <p className="mb-6 text-sm text-muted-foreground">Usá el email con el que te registraste.</p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="vos@email.com"
              autoComplete="email"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
            style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link to="/registro" className="font-semibold text-primary underline">
              Registrate acá
            </Link>
          </p>
        </form>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--color-border);background:var(--color-card);border-radius:.875rem;padding:.85rem 1rem;font-size:.95rem;outline:none;transition:border-color .15s}.input:focus{border-color:var(--color-primary)}`}</style>
    </div>
  );
}
