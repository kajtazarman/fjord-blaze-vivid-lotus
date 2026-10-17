import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AuthScreen } from "@/components/auth-screen";
import { useDocket, useDocketHydrated } from "@/lib/store";

function LoginPage() {
  const ready = useDocketHydrated();
  const signedIn = useDocket((state) => state.signedIn);
  if (!ready) return <div className="min-h-dvh bg-background" />;
  if (signedIn) return <Navigate to="/app" />;
  return <AuthScreen />;
}

export const Route = createFileRoute("/login")({ component: LoginPage });
