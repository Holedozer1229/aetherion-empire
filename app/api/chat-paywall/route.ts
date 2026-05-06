import { NextResponse } from "next/server";

const PLAN_CONFIG = {
  pro: {
    plan: "pro",
    monthlyPriceUsd: 29,
    trialDays: 7,
    stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY",
  },
  sovereign: {
    plan: "sovereign",
    monthlyPriceUsd: 199,
    trialDays: 7,
    stripePriceEnv: "STRIPE_PRICE_SOVEREIGN_MONTHLY",
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestedPlan = typeof body?.plan === "string" ? body.plan.toLowerCase() : "";

    if (!(requestedPlan in PLAN_CONFIG)) {
      return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 });
    }

    const plan = PLAN_CONFIG[requestedPlan as keyof typeof PLAN_CONFIG];
    const priceId = process.env[plan.stripePriceEnv];

    return NextResponse.json({
      success: true,
      checkout: {
        provider: "stripe",
        plan: plan.plan,
        monthly_price_usd: plan.monthlyPriceUsd,
        trial_days: plan.trialDays,
        auto_charge_after_trial: true,
        stripe_price_id_configured: Boolean(priceId),
        redirect_url: priceId
          ? `/api/stripe/checkout?price_id=${encodeURIComponent(priceId)}&trial_days=${plan.trialDays}`
          : null,
      },
      message: "7-day free agentic mode enabled. Billing auto-starts after trial via Stripe subscription.",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to initialize chat paywall" },
      { status: 500 }
    );
  }
}
