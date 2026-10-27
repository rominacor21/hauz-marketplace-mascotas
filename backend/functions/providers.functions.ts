import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ProviderIdSchema = z.object({ id: z.string().uuid() });

/**
 * Returns a single provider's WhatsApp number on explicit user request.
 * The column is revoked from anon/authenticated at the DB level, so this
 * server-side function is the only path to read it. Loaded inside the
 * handler so the admin client never leaks into the client bundle.
 */
export const getProviderWhatsapp = createServerFn({ method: "POST" })
  .inputValidator((data) => ProviderIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("providers")
      .select("whatsapp")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !row) return { whatsapp: null as string | null };
    return { whatsapp: row.whatsapp as string | null };
  });
