import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { trackVisit } from "@/lib/analytics";
import { registrarEvento } from "@/lib/experiment";
import { BadgeCheck, Star, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/servicios")({
  head: () => ({ meta: [{ title: "Servicios — Hauz" }] }),
  component: ServiciosPage,
});

type Provider = {
  id: string; nombre: string; servicio: string; zona: string;
  precio_referencia: string | null; rating: number | null;
  descripcion: string | null; verificado: boolean;
};

const SERVICIOS = ["Todos", "Paseador", "Cuidador", "Adiestrador", "Guardería"];

// Número de WhatsApp de la operación concierge del MVP. Se define en .env para no publicarlo en el repo.
const WHATSAPP_CONCIERGE = import.meta.env.VITE_WHATSAPP_CONCIERGE ?? "";

function ServiciosPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    trackVisit("servicios");
    registrarEvento("ver_dimension", { dimension: "servicios" });
    supabase.from("providers").select("id,nombre,servicio,zona,precio_referencia,rating,descripcion,verificado").order("rating", { ascending: false }).then(({ data }) => {
      if (data) setProviders(data as Provider[]);
    });
  }, []);

  const filtered = useMemo(
    () => providers.filter((p) => filter === "Todos" || p.servicio === filter),
    [providers, filter],
  );

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold">Servicios</h1>
      <p className="mt-1 text-sm text-muted-foreground">Paseadores, cuidadores y más</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {SERVICIOS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((p) => (
          <article key={p.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">{p.nombre}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.servicio} · {p.zona}</p>
                {p.precio_referencia && (
                  <p className="mt-1 text-sm font-semibold text-foreground">{p.precio_referencia}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                    <Star size={12} className="fill-primary text-primary" /> {p.rating?.toFixed(1) ?? "—"}
                  </span>
                  {p.verificado && (
                    <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                      <BadgeCheck size={10} /> Hauz
                    </span>
                  )}
                </div>
                {p.descripcion && <p className="mt-2 text-xs text-muted-foreground">{p.descripcion}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_CONCIERGE}?text=Hola%20quiero%20más%20información`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackVisit("servicios", { action: "whatsapp_contact" });
                registrarEvento("click_whatsapp", { detalle: { proveedor: p.id, nombre: p.nombre } });
              }}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground transition-transform active:scale-[0.98]"
            >
              <MessageCircle size={16} /> Contactar por WhatsApp
            </a>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
