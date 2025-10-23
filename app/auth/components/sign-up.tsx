"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/app/store/user";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
  .object({
    name: z.string().nonempty({ message: "Este campo é obrigatório." }),
    email: z.string().email({ message: "E-mail inválido." }),
    password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
    confirmPassword: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function Signup() {
  type formSchema = z.infer<typeof formSchema>;
  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { addToUser } = useStore();

  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/catalog";

  const handleSignup = async ({ name, email }: formSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    addToUser({
      name,
      email,
      isAuthenticate: true,
    });
    router.push(redirect);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo </FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner /> Criando conta...{" "}
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>
    </Form>
  );
}
