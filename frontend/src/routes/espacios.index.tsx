import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { trackVisit } from "@/lib/analytics";
import { registrarEvento } from "@/lib/experiment";
import { BadgeCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/espacios/")({
  head: () => ({ meta: [{ title: "Espacios pet-friendly — Hauz" }] }),
  component: EspaciosPage,
});

type Space = {
  id: string; nombre: string; direccion: string; barrio: string;
  categoria: string; horario: string | null; verificado: boolean;
};

const BARRIOS = ["Todos", "Pocitos", "Punta Carretas", "Buceo", "Parque Rodó"];
const CATS = ["Todas", "Cafe", "Parque", "Restaurante", "Veterinaria", "Pet Shop", "Plaza"];

function EspaciosPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [barrio, setBarrio] = useState("Todos");
  const [cat, setCat] = useState("Todas");

  useEffect(() => {
    trackVisit("espacios");
    registrarEvento("ver_dimension", { dimension: "espacios" });
    supabase.from("spaces").select("*").order("nombre").then(({ data }) => {
      if (data) setSpaces(data as Space[]);
    });
  }, []);

  const filtered = useMemo(() => {
    return spaces.filter((s) =>
      (barrio === "Todos" || s.barrio === barrio) && (cat === "Todas" || s.categoria === cat)
    );
  }, [spaces, barrio, cat]);

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold">Espacios pet-friendly</h1>
      <p className="mt-1 text-sm text-muted-foreground">{filtered.length} lugares verificados</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Pill items={BARRIOS} value={barrio} onChange={setBarrio} />
      </div>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        <Pill items={CATS} value={cat} onChange={setCat} />
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((s) => (
          <Link
            key={s.id}
            to="/espacios/$id"
            params={{ id: s.id }}
            className="block rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{s.nombre}</h2>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} /> {s.direccion} · {s.barrio}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                    {s.categoria}
                  </span>
                  {s.horario && <span className="text-[11px] text-muted-foreground">{s.horario}</span>}
                </div>
              </div>
              {s.verificado && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success">
                  <BadgeCheck size={12} /> Hauz
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}

function Pill({ items, value, onChange }: { items: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <>
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onChange(it)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            value === it ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
          }`}
        >
          {it}
        </button>
      ))}
    </>
  );
}
