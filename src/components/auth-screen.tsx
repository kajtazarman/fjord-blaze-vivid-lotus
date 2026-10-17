import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocket, issuedTwoFactorCode } from "@/lib/store";
import { cn } from "@/lib/utils";
import { currentCode } from "@/lib/two-factor";

export function AuthScreen() {
  const register = useDocket((state) => state.register);
  const login = useDocket((state) => state.login);
  const resetPassword = useDocket((state) => state.resetPassword);
  const confirmCode = useDocket((state) => state.confirmCode);
  const accountEmail = useDocket((state) => state.account.email);
  const hasPassword = useDocket((state) => Boolean(state.password));
  const [mode, setMode] = useState<"login" | "register">("login");
  const [forgot, setForgot] = useState(false);
  const [resetReady, setResetReady] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (needsCode) {
      const result = await confirmCode(code);
      setBusy(false);
      if (result === "wrong") toast.error("That code is wrong.");
      return;
    }
    if (forgot && mode === "login") {
      if (!resetReady) {
        setBusy(false);
        const known = accountEmail.trim().toLowerCase();
        if (!hasPassword || !known || email.trim().toLowerCase() !== known) {
          toast.error("No account uses that email.");
          return;
        }
        setResetReady(true);
        setPassword("");
        return;
      }
      const result = await resetPassword(email, password);
      setBusy(false);
      if (result === "short") toast.error("Password needs at least 8 characters.");
      else if (result === "none") toast.error("No account uses that email.");
      else {
        toast.success("Password updated. Log in.");
        setPassword("");
        setForgot(false);
        setResetReady(false);
      }
      return;
    }
    if (mode === "login") {
      const result = await login(email, password);
      setBusy(false);
      if (result === "none") toast.error("No account yet. Register first.");
      else if (result === "wrong") toast.error("Email or password is wrong.");
      else if (result === "otp") {
        const factor = useDocket.getState().twoFactor;
        const sent = issuedTwoFactorCode();
        if (factor?.method === "phone") {
          toast.message(`Code sent to your phone${sent ? `: ${sent}` : ""}`);
        } else if (factor?.method === "email") {
          toast.message(`Code sent to your email${sent ? `: ${sent}` : ""}`);
        } else {
          const appCode = factor ? await currentCode(factor.secret) : "";
          toast.message(appCode ? `Authenticator code: ${appCode}` : "Enter the code from your authenticator app");
        }
        setNeedsCode(true);
        setCode("");
      }
      return;
    }
    const result = await register({ firstName, lastName, email, password });
    setBusy(false);
    if (result === "email") toast.error("Enter a real email.");
    else if (result === "short") toast.error("Password needs at least 8 characters.");
    else if (result === "exists") toast.error("An account already exists. Log in.");
  }

  return (
    <div className="notion-light bg-white text-[#37352f]">
      <div className="flex min-h-dvh flex-col">
        <main className="flex flex-1 flex-col items-center px-4 pt-16 pb-10 sm:pt-[18vh]">
          <Link to="/" aria-label="DigiSef" className="text-4xl font-bold tracking-[-0.06em] text-black">
            DigiSef
          </Link>
          <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setForgot(false);
                setResetReady(false);
              }}
              className={cn(
                "h-9 rounded-md text-sm",
                mode === "login" ? "bg-[#0075de] text-white" : "bg-[#f6f5f4] text-black",
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setForgot(false);
                setResetReady(false);
              }}
              className={cn(
                "h-9 rounded-md text-sm",
                mode === "register" ? "bg-[#0075de] text-white" : "bg-[#f6f5f4] text-black",
              )}
            >
              Register
            </button>
          </div>
          <form onSubmit={(event) => void submit(event)} className="mt-4 grid w-full max-w-sm gap-2.5">
            {needsCode ? (
              <Input
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter code"
                aria-label="Authentication code"
                autoComplete="one-time-code"
                className="border-[#e6e5e3] bg-white"
                required
              />
            ) : (
              <>
            {mode === "register" ? (
              <>
                <Input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  aria-label="First name"
                  autoComplete="given-name"
                  className="border-[#e6e5e3] bg-white"
                />
                <Input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  aria-label="Last name"
                  autoComplete="family-name"
                  className="border-[#e6e5e3] bg-white"
                />
              </>
            ) : null}
            <Input
              type={mode === "login" && !forgot ? "text" : "email"}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={forgot ? "Enter email" : mode === "login" ? "Email or user" : "Email"}
              aria-label={forgot ? "Enter email" : mode === "login" ? "Email or user" : "Email"}
              autoComplete="username"
              className="border-[#e6e5e3] bg-white"
              required
            />
            {forgot && mode === "login" && !resetReady ? null : (
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={forgot ? "New password" : "Password"}
                aria-label={forgot ? "New password" : "Password"}
                autoComplete={mode === "login" && !forgot ? "current-password" : "new-password"}
                className="border-[#e6e5e3] bg-white"
                required
              />
            )}
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setForgot((open) => !open);
                  setResetReady(false);
                }}
                className="justify-self-start text-sm text-[#37352f]/60"
              >
                {forgot ? "Back to login" : "Forgot password"}
              </button>
            ) : null}
              </>
            )}
            <Button type="submit" disabled={busy} className="mt-1 h-9 w-full rounded-md bg-[#0075de] text-white hover:bg-[#005bab]">
              {needsCode
                ? "Confirm code"
                : forgot && mode === "login"
                  ? resetReady
                    ? "Change password"
                    : "Continue"
                  : mode === "login"
                    ? "Continue"
                    : "Create account"}
            </Button>
          </form>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
