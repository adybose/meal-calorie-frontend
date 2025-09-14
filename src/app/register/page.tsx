'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  first_name: z.string().min(1, 'First name required'),
  last_name: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { register: reg } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { first_name: '', last_name: '', email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await reg(data)
      toast({ title: 'Success', description: 'Registered! Redirecting...' })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input placeholder="First Name" {...form.register('first_name')} />
                {form.formState.errors.first_name && <p className="text-sm text-red-500">{form.formState.errors.first_name.message}</p>}
              </div>
              <div>
                <Input placeholder="Last Name" {...form.register('last_name')} />
                {form.formState.errors.last_name && <p className="text-sm text-red-500">{form.formState.errors.last_name.message}</p>}
              </div>
            </div>
            <div>
              <Input placeholder="Email" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="Password" {...form.register('password')} />
              {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </form>
          <p className="text-center mt-4">Have account? <a href="/login" className="text-blue-500">Login</a></p>
        </CardContent>
      </Card>
    </div>
  )
}
