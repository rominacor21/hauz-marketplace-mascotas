import { createFileRoute, Link } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/espacios")({
  component: () => <Outlet />,
});

// re-export Link to avoid unused import warning
export const _ = Link;
