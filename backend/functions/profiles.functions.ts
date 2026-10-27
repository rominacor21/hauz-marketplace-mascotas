import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RegisterSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  barrio: z.string().trim().min(1).max(50),
  edad: z.string().trim().min(1).max(30),
  tiene_perro: z.boolean(),
});

export const registerProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RegisterSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("profiles")
      .insert(data)
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") return { error: "duplicate" as const };
      return { error: "unknown" as const };
    }
    return { id: row.id };
  });

const IdSchema = z.object({ id: z.string().uuid() });

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export const loginByEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LoginSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (!row) return { error: "not_found" as const };
    return { id: row.id };
  });

export const getOwnProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => IdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("profiles")
      .select("id,nombre,email,barrio,plan")
      .eq("id", data.id)
      .maybeSingle();
    return row;
  });

export const getOwnVisits = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => IdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("analytics_events")
      .select("section_visited,created_at")
      .eq("user_id", data.id)
      .order("created_at", { ascending: false })
      .limit(30);
    return rows ?? [];
  });

const UpdatePlanSchema = z.object({
  id: z.string().uuid(),
  plan: z.enum(["integrado", "espacios", "servicios"]),
});

export const updateOwnPlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => UpdatePlanSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ plan: data.plan })
      .eq("id", data.id);
    return { ok: !error };
  });

const AdminSchema = z.object({ password: z.string().min(1).max(200) });

export const adminGetData = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AdminSchema.parse(data))
  .handler(async ({ data }) => {
    // La contraseña del panel se define solo por variable de entorno; sin ella, el panel queda cerrado.
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || data.password !== expected) {
      return { error: "unauthorized" as const };
    }
    const { supabaseAdmin } = await import("../supabase/client.server");
    const [{ data: users }, { data: events }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id,nombre,email,barrio,plan,created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("analytics_events").select("user_id,section_visited"),
    ]);
    return { users: users ?? [], events: events ?? [] };
  });

const TrackSchema = z.object({
  user_id: z.string().uuid().nullable().optional(),
  section_visited: z.string().min(1).max(50),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TrackSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../supabase/client.server");
    await supabaseAdmin.from("analytics_events").insert({
      user_id: data.user_id ?? null,
      section_visited: data.section_visited,
      metadata: (data.metadata ?? null) as never,
    });
    return { ok: true };
  });
