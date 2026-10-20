import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CHECKOUT_PLANS, type PaidPlan } from "@/lib/billing";
import { cn } from "@/lib/utils";

type LemonEvent = { event?: string };

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url: { Open: (url: string) => void };
      Setup: (options: { eventHandler: (data: LemonEvent) => void }) => void;
    };
  }
}

function checkoutHref(raw: string, embed: boolean) {
  const url = new URL(raw);
  if (embed) url.searchParams.set("embed", "1");
  return url.toString();
}

export function CheckoutScreen({
  onPaid,
}: {
  onPaid: (plan: PaidPlan) => void;
}) {
  const [picked, setPicked] = useState<PaidPlan>("lifetime");
  const paid = useRef(onPaid);
  paid.current = onPaid;
  const pickedRef = useRef(picked);
  pickedRef.current = picked;

  function openLemon(embed: boolean) {
    const plan = CHECKOUT_PLANS.find((item) => item.id === pickedRef.current);
    if (!plan?.url.startsWith("https://")) {
      toast.error("The Lemon Squeezy checkout link is not connected yet");
      return;
    }
    const href = checkoutHref(plan.url, embed);
    if (embed && window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(href);
      return;
    }
    window.location.assign(checkoutHref(plan.url, false));
  }

  useEffect(() => {
    const setup = () => {
      window.createLemonSqueezy?.();
      window.LemonSqueezy?.Setup({
        eventHandler(data) {
          if (data.event === "Checkout.Success") paid.current(pickedRef.current);
        },
      });
    };
    const existing = document.querySelector<HTMLScriptElement>("script[data-lemon]");
    if (existing) {
      setup();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.dataset.lemon = "1";
    script.onload = setup;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <main className="mx-auto flex w-full max-w-lg flex-col px-4 py-8">
          <p className="text-sm text-muted-foreground">DigiSef Plus</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Choose a plan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lemon Squeezy takes your name, address, email, and card.
          </p>
          <div className="mt-6 grid gap-3">
            {CHECKOUT_PLANS.map((plan) => {
              const lifetime = plan.id === "lifetime";
              const selected = picked === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPicked(plan.id)}
                  className={cn(
                    "rounded-lg px-4 text-left",
                    lifetime ? "min-h-36 py-5" : "py-4",
                    selected
                      ? "border-2 border-[#0075de] bg-[#e6f3fe] text-[#0075de]"
                      : "border border-transparent bg-card text-foreground shadow-[var(--shadow-card)]",
                  )}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={cn("font-medium", lifetime && "text-xl")}>{plan.name}</span>
                    <span className={cn("font-medium", lifetime ? "text-3xl" : "text-lg")}>
                      {plan.price}
                      <span className={cn("font-normal", selected ? "text-[#0075de]/70" : "text-muted-foreground")}>
                        {plan.interval === "once" ? "" : ` / ${plan.interval}`}
                      </span>
                    </span>
                  </span>
                  <span className={cn("mt-2 block text-sm", selected ? "text-[#0075de]" : "text-muted-foreground")}>
                    {plan.note}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-6 h-11 rounded-lg bg-foreground text-sm font-medium text-background"
            onClick={() => openLemon(true)}
          >
            Pay with Lemon Squeezy
          </button>
          <button type="button" className="mt-3 text-sm text-muted-foreground" onClick={() => openLemon(false)}>
            Open the checkout page instead
          </button>
        </main>
    </div>
  );
}
