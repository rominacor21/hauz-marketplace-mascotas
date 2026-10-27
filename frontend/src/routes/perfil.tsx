import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getOwnProfile, getOwnVisits } from "@backend/functions/profiles.functions";
import { getUserId, clearUserId } from "@/lib/session";
import { trackVisit } from "@/lib/analytics";
import { LogOut, Mail, MapPin, Sparkles } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — Hauz" }] }),
  component: PerfilPage,
});

type Profile = { id: string; nombre: string; email: string; barrio: string; plan: string | null };
type Visit = { section_visited: string; created_at: string };

const PLAN_LABEL: Record<string, string> = {
  integrado: "Plan Integrado",
  espacios: "Plan Espacios",
  servicios: "Plan Servicios",
};

function PerfilPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = getUserId();
    if (!id) return;
    trackVisit("perfil");
    getOwnProfile({ data: { id } }).then((data) => data && setProfile(data as Profile));
    getOwnVisits({ data: { id } }).then((data) => setVisits(data as Visit[]));
  }, []);

  if (mounted && !getUserId()) return <Navigate to="/registro" />;

  const logout = () => {
    clearUserId();
    navigate({ to: "/login" });
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold">Tu perfil</h1>
      {profile && (
        <>
          <section className="mt-5 rounded-2xl border border-border bg-card p-5">
            <p className="text-lg font-bold">{profile.nombre}</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail size={14} /> {profile.email}</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> {profile.barrio}</p>
              <p className="flex items-center gap-2"><Sparkles size={14} className="text-primary" />
                <span className="font-semibold text-foreground">{profile.plan ? PLAN_LABEL[profile.plan] ?? profile.plan : "Sin plan"}</span>
              </p>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Tu actividad</h2>
            {visits.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no visitaste ninguna sección.</p>
            ) : (
              <ul className="space-y-2">
                {visits.map((v, i) => (
                  <li key={i} className="flex justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
                    <span className="capitalize">{v.section_visited}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(v.created_at).toLocaleString("es-UY", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-foreground"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </>
      )}
    </AppShell>
  );
}
