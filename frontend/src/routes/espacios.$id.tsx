import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BadgeCheck, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/espacios/$id")({
  head: () => ({ meta: [{ title: "Detalle del espacio — Hauz" }] }),
  component: SpaceDetail,
});

type Space = {
  id: string; nombre: string; direccion: string; barrio: string;
  categoria: string; horario: string | null; descripcion: string | null; verificado: boolean;
};

function SpaceDetail() {
  const { id } = Route.useParams();
  const [space, setSpace] = useState<Space | null>(null);

  useEffect(() => {
    supabase.from("spaces").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setSpace(data as Space);
    });
  }, [id]);

  return (
    <AppShell>
      <Link to="/espacios" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Volver
      </Link>
      {!space ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold">{space.nombre}</h1>
            {space.verificado && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
                <BadgeCheck size={14} /> Verificado por Hauz
              </span>
            )}
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-foreground"><MapPin size={16} className="text-primary" /> {space.direccion} · {space.barrio}</p>
            {space.horario && <p className="flex items-center gap-2 text-foreground"><Clock size={16} className="text-primary" /> {space.horario}</p>}
          </div>
          <span className="mt-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {space.categoria}
          </span>
          {space.descripcion && (
            <p className="mt-5 text-sm leading-relaxed text-foreground">{space.descripcion}</p>
          )}
        </>
      )}
    </AppShell>
  );
}
