'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData?.session?.user) {
      // Ambil profile langsung dari client untuk mengecek role
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.session.user.id)
        .single()
      const profile = data as any

      if (profile?.role === 'admin') {
        window.location.assign('/admin')
      } else if (profile?.role === 'guru') {
        window.location.assign('/dashboard')
      } else {
        // Tampilkan detail error jika query ke profiles gagal
        setError(`Role tidak ditemukan. User ID: ${authData.session.user.id}. Error DB: ${profileError?.message || 'Data tidak ditemukan di database.'}`)
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Kiri: Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 pt-20 lg:pt-24 relative">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          <div className="flex flex-col items-center lg:items-start space-y-2 text-center lg:text-left mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 lg:mb-2">
              <ChefHat className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">CuliTrack</h1>
            <p className="text-muted-foreground">Digitalisasi Penilaian Praktik Tata Boga</p>
          </div>

          <Card className="border-0 shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-card">
            <CardHeader className="px-0 lg:px-6 pt-0 lg:pt-6">
              <CardTitle className="text-2xl">Masuk</CardTitle>
              <CardDescription>
                Masukkan email dan password akun Anda untuk melanjutkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 lg:px-6 pb-0 lg:pb-6">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6 text-sm font-medium">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@email.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? 'Menyiapkan dapur...' : 'Masuk ke Dashboard'}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Kanan: Panel Dekoratif (Sembunyi di Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary to-emerald-900 items-center justify-center p-12 overflow-hidden">
        {/* Dekorasi pola/bentuk abstrak ringan */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 text-primary-foreground max-w-lg text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Kelezatan dalam Setiap Penilaian</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed font-medium">
            Tinggalkan kertas rekap manual. Mulai nilai setiap kreasi masakan murid Anda dengan rapi, cepat, dan terpusat langsung dari genggaman Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
