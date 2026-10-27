import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EventoSchema = z.object({
  session_id: z.string().min(1).max(128),
  variante: z.enum(["A", "B"]).nullable(),
  user_id: z.string().uuid().nullable(),
  evento: z.string().min(1).max(64),
  dimension: z.string().max(64).nullable(),
  detalle: z.record(z.string(), z.unknown()).nullable(),
});

export const registrarEventoServer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EventoSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { error } = await (supabaseAdmin.from as any)("eventos").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
