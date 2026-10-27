import { getUserId } from "./session";
import { trackEvent } from "@backend/functions/profiles.functions";

export type Section = "espacios" | "servicios" | "orientacion" | "home" | "perfil";

export async function trackVisit(section: Section, metadata?: Record<string, unknown>) {
  const userId = getUserId();
  if (!userId) return;
  try {
    await trackEvent({ data: { user_id: userId, section_visited: section, metadata: metadata ?? null } });
  } catch (e) {
    console.warn("track failed", e);
  }
}
