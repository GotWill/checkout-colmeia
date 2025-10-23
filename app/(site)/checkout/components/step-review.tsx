import { useCartStore } from "@/app/store/cart";
import { PaymentMethod } from "@/app/types/checkout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Barcode, CreditCard, QrCode } from "lucide-react";

type StepReviewProps = {
  handleConfirmPayment: () => void;
  setStep: () => void;
  paymentMethod: PaymentMethod;
};

export default function StepReview({
  handleConfirmPayment,
  setStep,
  paymentMethod,
}: StepReviewProps) {
  
  const {cart} = useCartStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão do Pedido</CardTitle>
        <CardDescription>
          Confirme os detalhes antes de finalizar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 font-semibold">Itens do Pedido</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.cart.id} className="flex justify-between text-sm">
                <span>
                  {item.cart.name} x {item.quantity}
                </span>
                <span className="font-medium">
                  R$ {(item.cart.price * item.quantity).toFixed(2).replace(".", ",")}
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
            {paymentMethod === "credit-card" && (
              <CreditCard className="h-5 w-5" />
            )}
            {paymentMethod === "boleto" && <Barcode className="h-5 w-5" />}
            <span className="font-medium">
              {paymentMethod === "pix" && "PIX"}
              {paymentMethod === "credit-card" && "Cartão de Crédito"}
              {paymentMethod === "boleto" && "Boleto Bancário"}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={setStep} className="flex-1">
            Voltar
          </Button>
          <Button onClick={handleConfirmPayment} className="flex-1" size="lg">
            Confirmar Pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
