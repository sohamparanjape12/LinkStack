'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Aurora } from '@/components/aurora'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    console.log('Attempting login with:', { email, password: '***' })
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    console.log('Login response:', { data, error: authError })
    
    if (authError) {
      setError(authError.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const darkThemeColors = ["#3A29FF", "#00A9FF", "#7A00FF"]
  const lightThemeColors = ["#3A29FF", "#FFA9FF", "#7A00FF"]

  const [auroraColors, setAuroraColors] = useState<string[]>([])

  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'dark') {
      setAuroraColors(darkThemeColors)
    } else {
      setAuroraColors(lightThemeColors)
    }
  }, [theme])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 z-0">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={auroraColors as [string, string, string]}
          blend={0.4} // Softer blend
          amplitude={0.8} // Less aggressive amplitude
          speed={0.15} // Slower speed
        />
      </div>
      <Card className="w-full max-w-md z-100">
        <CardHeader>
          <CardTitle>Login to LinkStack</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&rsquo;t have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}