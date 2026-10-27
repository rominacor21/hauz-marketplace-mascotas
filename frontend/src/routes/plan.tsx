import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { updateOwnPlan } from "@backend/functions/profiles.functions";
import { getUserId } from "@/lib/session";
import { registrarEvento } from "@/lib/experiment";
import { Check } from "lucide-react";

export const Route = createFileRoute("/plan")({
  head: () => ({ meta: [{ title: "Elegí tu plan — Hauz" }] }),
  component: PlanPage,
});

type PlanKey = "integrado" | "espacios" | "servicios";

const PLANS: Array<{ key: PlanKey; title: string; desc: string; features: string[]; recommended?: boolean }> = [
  {
    key: "integrado",
    title: "Plan Integrado",
    desc: "Acceso completo a espacios, servicios y orientación.",
    features: ["Directorio de espacios", "Red de paseadores y cuidadores", "Contenido de orientación profesional"],
    recommended: true,
  },
  {
    key: "espacios",
    title: "Plan Espacios",
    desc: "Solo directorio de lugares pet-friendly.",
    features: ["Cafés, parques y veterinarias verificados", "Filtros por barrio y categoría"],
  },
  {
    key: "servicios",
    title: "Plan Servicios",
    desc: "Solo red de paseadores y cuidadores.",
    features: ["Paseadores, cuidadores y adiestradores", "Contacto directo por WhatsApp"],
  },
];

function PlanPage() {
  const navigate = useNavigate();
  const userId = typeof window !== "undefined" ? getUserId() : null;
  const [loading, setLoading] = useState<PlanKey | null>(null);

  useEffect(() => {
    registrarEvento("ver_planes");
  }, []);

  if (typeof window !== "undefined" && !userId) {
    return <Navigate to="/registro" />;
  }

  const choose = async (plan: PlanKey) => {
    if (!userId) return;
    setLoading(plan);
    const planInfo = PLANS.find((p) => p.key === plan);
    registrarEvento("elegir_plan", { detalle: { plan: planInfo?.title ?? plan } });
    await updateOwnPlan({ data: { id: userId, plan } });
    setLoading(null);
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-app py-8">
        <h1 className="mb-1 text-2xl font-extrabold">Elegí tu plan</h1>
        <p className="mb-6 text-sm text-muted-foreground">Todos arrancan gratis por 2 semanas.</p>

        <div className="space-y-4">
          {PLANS.map((p) => (
            <article
              key={p.key}
              className={`relative rounded-2xl border bg-card p-5 transition-shadow ${
                p.recommended ? "border-primary" : "border-border"
              }`}
              style={p.recommended ? { boxShadow: "var(--shadow-warm)" } : undefined}
            >
              {p.recommended && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                  Recomendado
                </span>
              )}
              <h2 className="text-lg font-extrabold text-foreground">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-success">Gratis por 2 semanas</p>
              <button
                onClick={() => choose(p.key)}
                disabled={loading !== null}
                className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-60 ${
                  p.recommended
                    ? "text-primary-foreground"
                    : "border border-border bg-secondary text-foreground"
                }`}
                style={p.recommended ? { background: "var(--gradient-warm)" } : undefined}
              >
                {loading === p.key ? "Guardando..." : "Empezar con este plan"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
