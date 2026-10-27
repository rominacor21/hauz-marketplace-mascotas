import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { trackVisit } from "@/lib/analytics";
import { registrarEvento } from "@/lib/experiment";

export const Route = createFileRoute("/orientacion/")({
  head: () => ({ meta: [{ title: "Orientación — Hauz" }] }),
  component: OrientacionPage,
});

type Article = {
  id: string; titulo: string; categoria: string; autor: string;
  thumbnail: string | null; resumen: string | null;
};

function OrientacionPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    trackVisit("orientacion");
    registrarEvento("ver_dimension", { dimension: "orientacion" });
    supabase.from("articles").select("id,titulo,categoria,autor,thumbnail,resumen").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setArticles(data as Article[]);
    });
  }, []);

  return (
    <AppShell>
      <h1 className="text-2xl font-extrabold">Orientación</h1>
      <p className="mt-1 text-sm text-muted-foreground">Guías y artículos profesionales</p>

      <div className="mt-5 space-y-4">
        {articles.map((a) => (
          <Link
            key={a.id}
            to="/orientacion/$id"
            params={{ id: a.id }}
            className="block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            {a.thumbnail && (
              <img src={a.thumbnail} alt={a.titulo} loading="lazy" className="h-40 w-full object-cover" />
            )}
            <div className="p-4">
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                {a.categoria}
              </span>
              <h2 className="mt-2 text-base font-bold leading-snug">{a.titulo}</h2>
              {a.resumen && <p className="mt-1 text-sm text-muted-foreground">{a.resumen}</p>}
              <p className="mt-2 text-xs text-muted-foreground">por {a.autor}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
