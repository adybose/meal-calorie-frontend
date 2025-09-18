"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { registerSchema, loginSchema, type RegisterFormData, type LoginFormData } from "@/lib/validations"
import { apiClient } from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "register"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setAuth } = useAuthStore()
  const router = useRouter()

  const isRegister = mode === "register"
  const schema = isRegister ? registerSchema : loginSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData | LoginFormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData | LoginFormData) => {
    setIsLoading(true)
    try {
      const response = isRegister
        ? await apiClient.register(data as RegisterFormData)
        : await apiClient.login(data as LoginFormData)
      
      console.log('[Auth Form] Full response structure:', JSON.stringify(response, null, 2))
      const token = response.access_token || response.token
      const user = response.user
      console.log('[Auth Form] Extracted - token present:', !!token, 'user present:', !!user, 'response keys:', Object.keys(response))
      
      setAuth(token || null, user || null)
      console.log('[Auth Form] setAuth called with token:', !!token, 'user:', !!user)
      
      toast({
        title: isRegister ? "Account created!" : "Welcome back!",
        description: isRegister ? "You can now start tracking calories." : "Successfully logged in.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error('[Auth Form] Login/Register error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{isRegister ? "Create Account" : "Welcome Back"}</CardTitle>
        <CardDescription>
          {isRegister ? "Enter your details to create your account" : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register("first_name")} placeholder="John" />
                {(errors as any).first_name && <p className="text-sm text-destructive">{(errors as any).first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register("last_name")} placeholder="Doe" />
                {(errors as any).last_name && <p className="text-sm text-destructive">{(errors as any).last_name.message}</p>}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRegister ? "Create Account" : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
