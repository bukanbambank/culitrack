'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChefHat, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      setError("Email atau password salah")
      setLoading(false)
      return
    }

    if (authData?.session?.user) {
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
        setError(`Role tidak ditemukan. Hubungi admin sekolah.`)
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-dvh flex bg-gradient-to-b from-[#FAF6F0] to-[#E8EFEA] lg:from-background lg:to-background">
      {/* Kiri: Area Form Login */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-12 relative">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          
          {/* Logo & Judul */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full shadow-md flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">CuliTrack</h1>
            <p className="text-sm text-muted-foreground mt-1">Digitalisasi Penilaian Praktik Tata Boga</p>
          </div>

          {/* Card Login */}
          <Card className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <CardContent className="p-0">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Masuk</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Masukkan detail akun untuk mengakses dashboard
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-destructive/15 text-destructive p-3 rounded-xl mb-6 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nama@email.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="h-12 pl-10 pr-4 text-base rounded-xl border-input focus-visible:ring-primary focus-visible:border-primary bg-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="h-12 pl-10 pr-10 text-base rounded-xl border-input focus-visible:ring-primary focus-visible:border-primary bg-white"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 mt-2 rounded-xl bg-primary text-white font-semibold active:scale-[0.98] transition-transform" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk ke Dashboard'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <div className="mt-8 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
            <p>Lupa password? Hubungi admin sekolah</p>
            <p>&copy; 2026 CuliTrack</p>
          </div>
        </div>
      </div>

      {/* Kanan: Panel Dekoratif (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary to-emerald-900 items-center justify-center p-12 overflow-hidden rounded-l-[3rem] shadow-2xl">
        {/* Dekorasi pola/bentuk abstrak ringan */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 text-primary-foreground max-w-lg text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/30 shadow-2xl">
            <ChefHat className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Kelezatan dalam <br /> Setiap Penilaian
          </h2>
          <p className="text-lg text-primary-foreground/90 leading-relaxed font-medium">
            Tinggalkan kertas rekap manual. Mulai nilai setiap kreasi masakan murid Anda dengan rapi, cepat, dan terpusat.
          </p>
        </div>
      </div>
    </div>
  )
}
