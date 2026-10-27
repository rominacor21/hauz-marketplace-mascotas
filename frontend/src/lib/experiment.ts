// A/B experiment tracking helper. Client-only.
import { getUserId } from "@/lib/session";
import { registrarEventoServer } from "@backend/functions/eventos.functions";


const SESSION_KEY = "hauz_exp_session_id";
const VARIANT_KEY = "hauz_exp_variant";
export type Variant = "A" | "B";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "sess-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getVariant(): Variant | null {
  if (typeof window === "undefined") return null;
  let v = localStorage.getItem(VARIANT_KEY) as Variant | null;
  if (v !== "A" && v !== "B") {
    v = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(VARIANT_KEY, v);
  }
  return v;
}

type Opciones = {
  dimension?: string;
  detalle?: Record<string, unknown>;
};

export async function registrarEvento(evento: string, opciones: Opciones = {}): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const session_id = getSessionId();
    const variante = getVariant();
    if (!session_id) return;
    const user_id = getUserId();
    await registrarEventoServer({
      data: {
        session_id,
        variante,
        user_id: user_id ?? null,
        evento,
        dimension: opciones.dimension ?? null,
        detalle: opciones.detalle ?? null,
      },
    });

  } catch {
    // silencioso: nunca rompe la UI
  }
}

let bootstrapped = false;
export function bootstrapExperiment(): void {
  if (typeof window === "undefined" || bootstrapped) return;
  bootstrapped = true;
  // Forzar inicialización
  getSessionId();
  getVariant();
  registrarEvento("sesion_inicio");
}
