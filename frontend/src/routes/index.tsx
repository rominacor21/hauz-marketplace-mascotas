import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, PawPrint, BookOpen } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hauz — Todo para vivir mejor con tu perro" },
      { name: "description", content: "Espacios verificados, servicios confiables y orientación profesional para dueños de perros en Montevideo." },
      { property: "og:title", content: "Hauz — Todo para vivir mejor con tu perro" },
      { property: "og:description", content: "Espacios verificados, servicios confiables y orientación profesional para dueños de perros en Montevideo." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <div className="container-app flex min-h-screen flex-col justify-between py-10">
        <header className="flex justify-center">
          <Logo size={48} withWordmark />
        </header>

        <main className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              Todo lo que necesitás para vivir mejor con tu perro, en un solo lugar
            </h1>
            <p className="text-base text-muted-foreground">
              Espacios verificados, servicios confiables y orientación profesional.
            </p>
          </div>

          <div className="grid w-full grid-cols-3 gap-3">
            <FeatureLink to="/espacios" icon={<MapPin />} label="Espacios" />
            <FeatureLink to="/servicios" icon={<PawPrint />} label="Servicios" />
            <FeatureLink to="/orientacion" icon={<BookOpen />} label="Orientación" />
          </div>
        </main>

        <div className="space-y-3">
          <Link
            to="/registro"
            className="block w-full rounded-2xl px-6 py-4 text-center text-base font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
            style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-warm)" }}
          >
            Quiero probar Hauz gratis
          </Link>
          <Link
            to="/login"
            className="block w-full rounded-2xl border border-border bg-card px-6 py-3 text-center text-sm font-semibold text-foreground"
          >
            Ya tengo cuenta · Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </Link>
  );
}
