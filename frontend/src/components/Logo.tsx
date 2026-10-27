import logo from "@/assets/hauz-logo.svg";

export function Logo({ size = 40, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Hauz" width={size} height={size} className="object-contain" />
      {withWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">Hauz</span>
      )}
    </div>
  );
}
