import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Barcode, CreditCard, QrCode } from "lucide-react";
import CreditCart from "./credit-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/app/types/checkout";

type StepPaymentProps = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  handlePaymentMethodSubmit: () => void;
};

export default function StepPayment({
  paymentMethod,
  setPaymentMethod,
  handlePaymentMethodSubmit,
}: StepPaymentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pagamento</CardTitle>
        <CardDescription>Escolha como deseja pagar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
        >
          <div className="space-y-3">
            <label
              htmlFor="pix"
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                paymentMethod === "pix"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value="pix" id="pix" />
              <QrCode className="h-6 w-6" />
              <div className="flex-1">
                <div className="font-semibold">PIX</div>
                <div className="text-sm text-muted-foreground">
                  Aprovação instantânea
                </div>
              </div>
            </label>

            <label
              htmlFor="credit-card"
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                paymentMethod === "credit-card"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value="credit-card" id="credit-card" />
              <CreditCard className="h-6 w-6" />
              <div className="flex-1">
                <div className="font-semibold">Cartão de Crédito</div>
                <div className="text-sm text-muted-foreground">
                  Parcelamento disponível
                </div>
              </div>
            </label>

            <label
              htmlFor="boleto"
              className={cn(
                "flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-colors",
                paymentMethod === "boleto"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value="boleto" id="boleto" />
              <Barcode className="h-6 w-6" />
              <div className="flex-1">
                <div className="font-semibold">Boleto Bancário</div>
                <div className="text-sm text-muted-foreground">
                  Vencimento em 3 dias úteis
                </div>
              </div>
            </label>
          </div>
        </RadioGroup>

        {paymentMethod === "credit-card" && <CreditCart handlePaymentMethodSubmit={handlePaymentMethodSubmit}/>}

        {paymentMethod !== "credit-card" && (
          <Button
            onClick={handlePaymentMethodSubmit}
            className="w-full"
            size="lg"
          >
            Continuar para Revisão
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
