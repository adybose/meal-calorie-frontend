import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          Meal Calorie Counter
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <AuthForm mode="login" />

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
