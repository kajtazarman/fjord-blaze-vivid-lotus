export type PaidPlan = "monthly" | "yearly" | "lifetime";

export type CheckoutPlan = {
  id: PaidPlan;
  name: string;
  price: string;
  interval: string;
  note: string;
  /** Lemon Squeezy buy link for this plan. */
  url: string;
};

export const CHECKOUT_PLANS: CheckoutPlan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "€9",
    interval: "month",
    note: "Billed every month. Cancel anytime.",
    url: "",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "€79",
    interval: "year",
    note: "One payment a year. Two months free.",
    url: "",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "€249",
    interval: "once",
    note: "Pay once. Plus stays on this account.",
    url: "",
  },
];
