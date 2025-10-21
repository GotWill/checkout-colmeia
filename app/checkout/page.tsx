"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"
import { CreditCard, Barcode, QrCode, Check, Loader2, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

type PaymentMethod = "pix" | "credit-card" | "boleto"
type CheckoutStep = "payment" | "review" | "processing" | "result"
type PaymentStatus = "success" | "failed" | "expired"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, user } = useStore()
  const [step, setStep] = useState<CheckoutStep>("payment")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  useEffect(() => {
    if (cart.length === 0 && step === "payment") {
      router.push("/catalog")
    }
  }, [cart, router, step])

  useEffect(() => {
    if (step === "processing") {
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Simular resultado aleatório
            const random = Math.random()
            if (random > 0.7) {
              setPaymentStatus("failed")
            } else if (random > 0.85) {
              setPaymentStatus("expired")
            } else {
              setPaymentStatus("success")
            }
            setStep("result")
            return 100
          }
          return prev + 10
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [step])

  const handlePaymentMethodSubmit = () => {
    setStep("review")
  }

  const handleConfirmPayment = () => {
    setStep("processing")
  }

  const handleTryAgain = () => {
    setPaymentStatus(null)
    setProcessingProgress(0)
    setStep("payment")
  }

  const handleBackToCatalog = () => {
    if (paymentStatus === "success") {
      clearCart()
    }
    router.push("/catalog")
  }

  const getStepNumber = () => {
    switch (step) {
      case "payment":
        return 1
      case "review":
        return 2
      case "processing":
        return 3
      case "result":
        return 4
      default:
        return 1
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Finalizar Compra</h1>
          <p className="mt-2 text-muted-foreground text-pretty">Complete seu pedido em poucos passos</p>
        </div>

        {/* Progress Steps */}
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
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {getStepNumber() > s.num ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className="mt-2 text-xs font-medium">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1 transition-colors",
                      getStepNumber() > s.num ? "bg-primary" : "bg-border",
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
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>Escolha como deseja pagar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                    <div className="space-y-3">
                      <label
                        htmlFor="pix"
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                          paymentMethod === "pix" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <RadioGroupItem value="pix" id="pix" />
                        <QrCode className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-semibold">PIX</div>
                          <div className="text-sm text-muted-foreground">Aprovação instantânea</div>
                        </div>
                      </label>

                      <label
                        htmlFor="credit-card"
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                          paymentMethod === "credit-card" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <CreditCard className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-semibold">Cartão de Crédito</div>
                          <div className="text-sm text-muted-foreground">Parcelamento disponível</div>
                        </div>
                      </label>

                      <label
                        htmlFor="boleto"
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                          paymentMethod === "boleto" ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Barcode className="h-6 w-6" />
                        <div className="flex-1">
                          <div className="font-semibold">Boleto Bancário</div>
                          <div className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input
                          id="card-number"
                          placeholder="0000 0000 0000 0000"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nome no Cartão</Label>
                        <Input
                          id="card-name"
                          placeholder="NOME COMPLETO"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Validade</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button onClick={handlePaymentMethodSubmit} className="w-full" size="lg">
                    Continuar para Revisão
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Revisão do Pedido</CardTitle>
                  <CardDescription>Confirme os detalhes antes de finalizar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-semibold">Itens do Pedido</h3>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-3 font-semibold">Método de Pagamento</h3>
                    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                      {paymentMethod === "pix" && <QrCode className="h-5 w-5" />}
                      {paymentMethod === "credit-card" && <CreditCard className="h-5 w-5" />}
                      {paymentMethod === "boleto" && <Barcode className="h-5 w-5" />}
                      <span className="font-medium">
                        {paymentMethod === "pix" && "PIX"}
                        {paymentMethod === "credit-card" && "Cartão de Crédito"}
                        {paymentMethod === "boleto" && "Boleto Bancário"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("payment")} className="flex-1">
                      Voltar
                    </Button>
                    <Button onClick={handleConfirmPayment} className="flex-1" size="lg">
                      Confirmar Pagamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Processing */}
            {step === "processing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Processando Pagamento</CardTitle>
                  <CardDescription>Aguarde enquanto processamos seu pagamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="mb-6 h-16 w-16 animate-spin text-primary" />
                    <p className="mb-4 text-lg font-medium">Processando...</p>
                    <Progress value={processingProgress} className="w-full max-w-xs" />
                    <p className="mt-2 text-sm text-muted-foreground">{processingProgress}%</p>
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
                      <h2 className="mb-2 text-2xl font-bold text-balance">Pagamento Aprovado!</h2>
                      <p className="mb-6 text-muted-foreground text-pretty">
                        Seu pedido foi confirmado e será processado em breve.
                      </p>
                      <div className="mb-6 w-full rounded-lg border bg-muted/30 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Número do Pedido</span>
                          <span className="font-mono font-semibold">#ORD-{Math.floor(Math.random() * 100000)}</span>
                        </div>
                      </div>
                      <Button onClick={handleBackToCatalog} className="w-full" size="lg">
                        Voltar ao Catálogo
                      </Button>
                    </div>
                  )}

                  {paymentStatus === "failed" && (
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <X className="h-10 w-10 text-destructive" />
                      </div>
                      <h2 className="mb-2 text-2xl font-bold text-balance">Pagamento Recusado</h2>
                      <p className="mb-6 text-muted-foreground text-pretty">
                        Não foi possível processar seu pagamento. Verifique os dados e tente novamente.
                      </p>
                      <div className="flex w-full gap-3">
                        <Button onClick={handleBackToCatalog} variant="outline" className="flex-1 bg-transparent">
                          Voltar ao Catálogo
                        </Button>
                        <Button onClick={handleTryAgain} className="flex-1" size="lg">
                          Tentar Novamente
                        </Button>
                      </div>
                    </div>
                  )}

                  {paymentStatus === "expired" && (
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
                        <AlertCircle className="h-10 w-10 text-warning" />
                      </div>
                      <h2 className="mb-2 text-2xl font-bold text-balance">Pagamento Expirado</h2>
                      <p className="mb-6 text-muted-foreground text-pretty">
                        O tempo para completar o pagamento expirou. Por favor, tente novamente.
                      </p>
                      <div className="flex w-full gap-3">
                        <Button onClick={handleBackToCatalog} variant="outline" className="flex-1 bg-transparent">
                          Voltar ao Catálogo
                        </Button>
                        <Button onClick={handleTryAgain} className="flex-1" size="lg">
                          Tentar Novamente
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-accent">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                {user && (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm font-medium">Enviando para:</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
