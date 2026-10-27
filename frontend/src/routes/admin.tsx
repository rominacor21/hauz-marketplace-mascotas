import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminGetData } from "@backend/functions/profiles.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Hauz" }] }),
  component: AdminPage,
});

type Row = { id: string; nombre: string; email: string; barrio: string; plan: string | null; created_at: string };
type Event = { user_id: string | null; section_visited: string };

function AdminPage() {
  const [users, setUsers] = useState<Row[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    const result = await adminGetData({ data: { password: pwd } });
    setLoading(false);
    if ("error" in result) {
      setError("Clave incorrecta.");
      return;
    }
    setUsers(result.users as Row[]);
    setEvents(result.events as Event[]);
    setAuth(true);
  };

  if (!auth) {
    return (
      <div className="container-app py-16">
        <h1 className="text-xl font-bold">Panel admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Ingresá la clave.</p>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          className="mt-4 w-full rounded-xl border border-border bg-card px-3 py-2"
          placeholder="Clave"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Verificando..." : "Entrar"}
        </button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    );
  }


  const total = users.length;
  const byPlan = users.reduce<Record<string, number>>((acc, u) => {
    const k = u.plan ?? "sin plan";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const sectionsByUser = events.reduce<Record<string, Set<string>>>((acc, e) => {
    if (!e.user_id) return acc;
    const dim = e.section_visited;
    if (!["espacios", "servicios", "orientacion"].includes(dim)) return acc;
    (acc[e.user_id] ??= new Set()).add(dim);
    return acc;
  }, {});
  const multi = Object.values(sectionsByUser).filter((s) => s.size > 1).length;
  const activos = Object.keys(sectionsByUser).length;
  const pctMulti = activos ? Math.round((multi / activos) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-2xl font-extrabold">Panel Hauz</h1>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total registrados" value={total} />
          <Stat label="Plan Integrado" value={byPlan["integrado"] ?? 0} />
          <Stat label="Plan Espacios" value={byPlan["espacios"] ?? 0} />
          <Stat label="Plan Servicios" value={byPlan["servicios"] ?? 0} />
          <Stat label="Usuarios activos" value={activos} />
          <Stat label="Usaron >1 dimensión" value={`${multi} (${pctMulti}%)`} />
          <Stat label="Eventos totales" value={events.length} />
        </div>

        <h2 className="mt-10 mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Usuarios</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Barrio</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Secciones usadas</th>
                <th className="p-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const secs = Array.from(sectionsByUser[u.id] ?? []);
                return (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3 font-semibold">{u.nombre}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.barrio}</td>
                    <td className="p-3">{u.plan ?? "—"}</td>
                    <td className="p-3">{secs.length ? secs.join(", ") : "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleString("es-UY")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}
