import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, PawPrint, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { getOwnProfile } from "@backend/functions/profiles.functions";
import { getUserId } from "@/lib/session";
import { trackVisit } from "@/lib/analytics";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Inicio — Hauz" }] }),
  component: HomePage,
});

type SectionKey = "espacios" | "servicios" | "orientacion";

const ALL_CARDS: Array<{
  key: SectionKey;
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  { key: "espacios", to: "/espacios", title: "Espacios pet-friendly", desc: "Cafés, parques, veterinarias y plazas verificadas.", icon: <MapPin size={28} /> },
  { key: "servicios", to: "/servicios", title: "Servicios de cuidado y paseo", desc: "Paseadores, cuidadores y adiestradores de confianza.", icon: <PawPrint size={28} /> },
  { key: "orientacion", to: "/orientacion", title: "Orientación y comportamiento", desc: "Guías y artículos de profesionales.", icon: <BookOpen size={28} /> },
];

const PLAN_SECTIONS: Record<string, SectionKey[]> = {
  integrado: ["espacios", "servicios", "orientacion"],
  espacios: ["espacios"],
  servicios: ["servicios"],
};

function HomePage() {
  const [userName, setUserName] = useState<string>("");
  const [plan, setPlan] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = getUserId();
    if (!id) return;
    trackVisit("home");
    getOwnProfile({ data: { id } })
      .then((data) => {
        if (data) {
          setUserName(data.nombre.split(" ")[0]);
          setPlan(data.plan ?? null);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  if (mounted && !getUserId()) return <Navigate to="/registro" />;

  const allowed = plan && PLAN_SECTIONS[plan] ? PLAN_SECTIONS[plan] : [];
  const visible = ALL_CARDS.filter((c) => allowed.includes(c.key));

  return (
    <AppShell>
      <header className="mb-6 flex items-center justify-between">
        <Logo size={36} withWordmark />
      </header>
      <h1 className="text-2xl font-extrabold leading-tight">
        Hola{userName ? `, ${userName}` : ""} 👋
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">¿Qué necesitás hoy?</p>

      <div className="mt-6 space-y-4">
        {!loaded ? (
          <>
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
            <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          </>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Todavía no elegiste un plan.{" "}
            <Link to="/plan" className="font-semibold text-primary underline">
              Elegir plan
            </Link>
          </div>
        ) : (
          visible.map((c) => (
            <BigCard key={c.key} to={c.to} title={c.title} desc={c.desc} icon={c.icon} section={c.key} />
          ))
        )}
      </div>
    </AppShell>
  );
}

function BigCard({
  to, title, desc, icon, section,
}: { to: string; title: string; desc: string; icon: React.ReactNode; section: "espacios" | "servicios" | "orientacion" }) {
  return (
    <Link
      to={to}
      onClick={() => trackVisit(section, { source: "home_card" })}
      className="block rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-extrabold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
