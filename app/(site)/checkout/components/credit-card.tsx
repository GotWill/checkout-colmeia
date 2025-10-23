import { useCartStore } from "@/app/store/cart";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/format-price";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { FormEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  number: z
    .string()
    .min(1, { message: "Campo obrigatório" })
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => val.length === 16, {
      message: "Cartão deve ter 16 dígitos",
    }),
  name: z.string().min(2, { message: "Campo obrigatorio" }),
  cvv: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => val.length >= 3 && val.length <= 4, { 
      message: "CVV deve ter entre 3 e 4 dígitos" 
    }),
  installments: z.string().nonempty({ message: "Campo obrigatorio" }),
});

type schema = z.infer<typeof schema>;

type CreditCartProps = {
  handlePaymentMethodSubmit: () => void;
};

export default function CreditCart({
  handlePaymentMethodSubmit,
}: CreditCartProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const { cart } = useCartStore();

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.cart.price * item.quantity,
    0
  );

  const form = useForm<schema>({
    defaultValues: {
      number: "",
      name: "",
      cvv: "",
      installments: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  function handleClick() {
    if (!date) {
      setError("Campo obrigatorio");
      return;
    }
  }

  useEffect(() => {
    if (date !== undefined) {
      setError("");
    }
  }, [date]);

  function sendData(data: schema) {
    if (date !== undefined) {
      handlePaymentMethodSubmit();
    }
  }

  function handleChangeInputCredit(event: FormEvent<HTMLInputElement>) {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, "");
    value = value.substring(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
    setValue("number", value);
    if (value.length === 16) {
      form.clearErrors("number");
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(sendData)}>
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Cartão</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleChangeInputCredit}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="my-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome no Cartão</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NOME COMPLETO"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length >= 2) {
                          form.clearErrors("name");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-4">
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parcelas</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full ${
                          errors.installments && "border border-red-600"
                        }`}
                      >
                        <SelectValue placeholder="Parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (item) => (
                            <SelectItem key={item} value={item.toString()}>
                              {item}x de {formatPrice(cartTotal / item)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <FormLabel>Selecione uma data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal hover:bg-transparent"
                  >
                    <CalendarIcon />
                    {date ? date.toLocaleDateString() : "MM/YY"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                  className="border"
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    fromYear={2025}
                    toYear={2035}
                    disabled={(date) => date < new Date(2025, 0, 1)}
                    onSelect={(date) => {
                      setDate(date);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {error && (
                <span className="text-destructive text-sm">{error}</span>
              )}
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="123"
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length >= 3) {
                            form.clearErrors("cvv");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" onClick={handleClick} className="w-full mt-4">
            Continuar para Revisão
          </Button>
        </form>
      </Form>
    </div>
  );
}
