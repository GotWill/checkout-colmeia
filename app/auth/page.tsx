
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Signin from "./components/sign-in"
import Signup from "./components/sign-up"

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <span className="text-xl font-bold text-primary-foreground">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Bem-vindo à Store</h1>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">Entre ou crie sua conta para continuar</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Entre com suas credenciais para acessar sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <Signin/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <Signup/>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
