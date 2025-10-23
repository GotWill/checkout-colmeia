import { PaymentStatus } from "@/app/types/checkout";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

type PaymentStatusFailedProps = {
  handleBackToCatalog: () => void;
  handleTryAgain: () => void;
  paymentStatus: PaymentStatus;
};

export default function PaymentStatusFailed({
  handleBackToCatalog,
  handleTryAgain,
  paymentStatus,
}: PaymentStatusFailedProps) {
  return (
    <>
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          {paymentStatus === "failed" && <X className="h-10 w-10 text-destructive" />}
          {paymentStatus === "expired" && <AlertCircle className="h-10 w-10 text-warning" />}
        </div>
        <h2 className="mb-2 text-2xl font-bold text-balance">
          {paymentStatus === "failed" && "Pagamento Recusado"}
          {paymentStatus === "expired" && "Pagamento Expirado"}
        </h2>
        <p className="mb-6 text-muted-foreground text-pretty">
          {paymentStatus === "failed" &&
            " Não foi possível processar seu pagamento. Verifique os dados e tente novamente."}

          {paymentStatus === "expired" &&
            "O tempo para completar o pagamento expirou. Por favor, tente novamente."}
        </p>
        <div className="flex flex-col md:flex-row w-full gap-3">
          <Button
            onClick={handleBackToCatalog}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            Voltar ao Catálogo
          </Button>
          <Button onClick={handleTryAgain} className="md:flex-1" size="lg">
            Tentar Novamente
          </Button>
        </div>
      </div>
    </>
  );
}
