import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MapPin, PawPrint, BookOpen, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/espacios", label: "Espacios", icon: MapPin },
  { to: "/servicios", label: "Servicios", icon: PawPrint },
  { to: "/orientacion", label: "Orientación", icon: BookOpen },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-app flex items-center justify-between py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
