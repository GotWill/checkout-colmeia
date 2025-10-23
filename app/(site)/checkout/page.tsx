"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import StepReview from "./components/step-review";
import StepPayment from "./components/step-payment";
import PaymentStatusFailedAndExpired from "./components/payment-status-failed-and-expired";
import Resume from "./components/resume";
import { useStore } from "@/app/store/user";
import { useCartStore } from "@/app/store/cart";
import {
  CheckoutStep,
  PaymentMethod,
  PaymentStatus,
} from "@/app/types/checkout";

export default function CheckoutPage() {
  const router = useRouter();

  const { user, userHydrated } = useStore();
  const { cart, clearCart, cartHydrated } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("payment");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [processingProgress, setProcessingProgress] = useState(0);

  if (userHydrated && !user.isAuthenticate) redirect("/auth");

  useEffect(() => {
    if (cartHydrated && cart.length === 0 && step === "payment") {
      redirect("/catalog");
    }
  }, [cart, step]);

  useEffect(() => {
    if (step === "processing") {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simular resultado aleatório
            const random = Math.random();
            if (random > 0.85) {
              setPaymentStatus("failed");
            } else if (random > 0.7) {
              setPaymentStatus("expired");
            } else {
              setPaymentStatus("success");
            }
            setStep("result");
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [step]);

  if (!userHydrated || !cartHydrated) return null;

  const handlePaymentMethodSubmit = () => {
    setStep("review");
  };

  const handleConfirmPayment = () => {
    setStep("processing");
  };

  const handleTryAgain = () => {
    setPaymentStatus(null);
    setProcessingProgress(0);
    setStep("payment");
  };

  const handleBackToCatalog = () => {
    if (paymentStatus === "success") {
      clearCart();
    }
    router.push("/catalog");
  };

  const getStepNumber = () => {
    switch (step) {
      case "payment":
        return 1;
      case "review":
        return 2;
      case "processing":
        return 3;
      case "result":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Finalizar Compra
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Complete seu pedido em poucos passos
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Pagamento" },
              { num: 2, label: "Revisão" },
              { num: 3, label: "Processando" },
              { num: 4, label: "Conclusão" },
            ].map((s, idx) => (
              <div key={s.num} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                      getStepNumber() >= s.num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {getStepNumber() > s.num ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className="mt-2 text-[10px] md:text-xs font-medium">
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={cn(
                      "mx-2 w-5 md:w-full h-0.5 flex-1 transition-colors",
                      getStepNumber() > s.num ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Step 1: Payment Method */}
            {step === "payment" && (
              <StepPayment
                handlePaymentMethodSubmit={handlePaymentMethodSubmit}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <StepReview
                handleConfirmPayment={handleConfirmPayment}
                setStep={() => setStep("payment")}
                paymentMethod={paymentMethod}
              />
            )}

            {/* Step 3: Processing */}
            {step === "processing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Processando Pagamento</CardTitle>
                  <CardDescription>
                    Aguarde enquanto processamos seu pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="mb-6 h-16 w-16 animate-spin text-primary" />
                    <p className="mb-4 text-lg font-medium">Processando...</p>
                    <Progress
                      value={processingProgress}
                      className="w-full max-w-xs"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {processingProgress}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Result */}
            {step === "result" && (
              <Card>
                <CardContent className="p-8">
                  {paymentStatus === "success" && (
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                        <Check className="h-10 w-10 text-success" />
                      </div>
                      <h2 className="mb-2 text-2xl font-bold text-balance">
                        Pagamento Aprovado!
                      </h2>
                      <p className="mb-6 text-muted-foreground text-pretty">
                        Seu pedido foi confirmado e será processado em breve.
                      </p>
                      <div className="mb-6 w-full rounded-lg border bg-muted/30 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Número do Pedido
                          </span>
                          <span className="font-semibold">
                            #ORD-{Math.floor(Math.random() * 100000)}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={handleBackToCatalog}
                        className="w-full"
                        size="lg"
                      >
                        Voltar ao Catálogo
                      </Button>
                    </div>
                  )}

                  {(paymentStatus === "expired" ||
                    paymentStatus === "failed") && (
                    <PaymentStatusFailedAndExpired
                      paymentStatus={paymentStatus}
                      handleBackToCatalog={handleBackToCatalog}
                      handleTryAgain={handleTryAgain}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <Resume />
        </div>
      </main>
    </div>
  );
}
