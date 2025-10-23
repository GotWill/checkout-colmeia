
export type PaymentMethod = "pix" | "credit-card" | "boleto";
export type CheckoutStep = "payment" | "review" | "processing" | "result";
export type PaymentStatus = "success" | "failed" | "expired";