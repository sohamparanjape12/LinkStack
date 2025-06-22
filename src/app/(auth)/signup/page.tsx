'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Aurora } from '@/components/aurora'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for verification link!')
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={auroraColors as [string, string, string]}
          blend={0.4} // Softer blend
          amplitude={0.8} // Less aggressive amplitude
          speed={0.15} // Slower speed
        />
      </div>
      <Card className="w-full max-w-md z-100 shadow-lg">
        <CardHeader>
          <CardTitle>Sign Up for LinkStack</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                {message}
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}