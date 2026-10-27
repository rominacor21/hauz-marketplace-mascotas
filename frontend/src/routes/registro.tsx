import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { registerProfile } from "@backend/functions/profiles.functions";
import { setUserId } from "@/lib/session";
import { registrarEvento } from "@/lib/experiment";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Registro — Hauz" }] }),
  component: Registro,
});

const BARRIOS = ["Pocitos", "Punta Carretas", "Buceo", "Otro"] as const;
const EDADES = ["Menos de 25", "25-30", "31-35", "Más de 35"] as const;

function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", barrio: "", edad: "", tiene_perro: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nombre || !form.email || !form.barrio || !form.edad || !form.tiene_perro) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    const result = await registerProfile({
      data: {
        nombre: form.nombre.trim(),
        email: form.email.trim().toLowerCase(),
        barrio: form.barrio,
        edad: form.edad,
        tiene_perro: form.tiene_perro === "si",
      },
    });
    setLoading(false);
    if ("error" in result) {
      setError(result.error === "duplicate" ? "Ese email ya está registrado." : "No pudimos crear la cuenta.");
      return;
    }
    setUserId(result.id);
    registrarEvento("registro_completo");
    navigate({ to: "/plan" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app py-8">
        <div className="mb-8 flex justify-center">
          <Logo size={40} withWordmark />
        </div>
        <h1 className="mb-1 text-2xl font-extrabold">Creá tu cuenta</h1>
        <p className="mb-6 text-sm text-muted-foreground">Tardás menos de un minuto.</p>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Nombre">
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="input"
              placeholder="Tu nombre"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="vos@email.com"
            />
          </Field>
          <Field label="Barrio">
            <select value={form.barrio} onChange={(e) => setForm({ ...form, barrio: e.target.value })} className="input">
              <option value="">Elegí tu barrio</option>
              {BARRIOS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Edad">
            <select value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} className="input">
              <option value="">Elegí un rango</option>
              {EDADES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="¿Tenés perro?">
            <div className="grid grid-cols-2 gap-2">
              {[{v:"si",l:"Sí"},{v:"no",l:"No"}].map(({v,l}) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setForm({ ...form, tiene_perro: v })}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    form.tiene_perro === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
            style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
          >
            {loading ? "Creando cuenta..." : "Continuar"}
          </button>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="font-semibold text-primary underline">
              Entrar acá
            </Link>
          </p>
        </form>
      </div>
      <style>{`.input{width:100%;border:1px solid var(--color-border);background:var(--color-card);border-radius:.875rem;padding:.85rem 1rem;font-size:.95rem;outline:none;transition:border-color .15s}.input:focus{border-color:var(--color-primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
