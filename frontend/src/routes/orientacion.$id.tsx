import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/orientacion/$id")({
  head: () => ({ meta: [{ title: "Artículo — Hauz" }] }),
  component: ArticleDetail,
});

type Article = {
  id: string; titulo: string; categoria: string; autor: string;
  thumbnail: string | null; contenido: string;
};

function ArticleDetail() {
  const { id } = Route.useParams();
  const [a, setA] = useState<Article | null>(null);

  useEffect(() => {
    supabase.from("articles").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setA(data as Article);
    });
  }, [id]);

  return (
    <AppShell>
      <Link to="/orientacion" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Volver
      </Link>
      {!a ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <article>
          {a.thumbnail && <img src={a.thumbnail} alt={a.titulo} className="mb-4 h-48 w-full rounded-2xl object-cover" />}
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
            {a.categoria}
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight">{a.titulo}</h1>
          <p className="mt-1 text-xs text-muted-foreground">por {a.autor}</p>
          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {a.contenido.replace(/\*\*/g, "").replace(/\\n/g, "\n")}
          </div>
        </article>
      )}
    </AppShell>
  );
}
