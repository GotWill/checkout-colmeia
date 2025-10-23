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
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido." }),
  password: z.string().min(6, { message: "Mínimo de 6 caracteres." }),
});

export default function Signin() {
  const router = useRouter();

  type formSchema = z.infer<typeof formSchema>;

  const { login } = useStore();

  const params = useSearchParams()
  const redirect = params.get("redirect") ?? '/catalog'

  const handleLogin = async (data: formSchema) => {


    await new Promise((resolve) => setTimeout(resolve, 2000));
    const resonse = login(data.email);

    if (!resonse.status) {
      toast.info(resonse.message);
      return;
    }

    router.push(redirect);
  };

  const form = useForm<formSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit ,formState: {isSubmitting}} = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Entrando...</> : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
