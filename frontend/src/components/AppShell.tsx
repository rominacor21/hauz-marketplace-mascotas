import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container-app pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
