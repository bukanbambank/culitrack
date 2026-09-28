'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'
import { Menu, ChefHat } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'

export function NavbarGuru() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Penilaian', href: '/kelas' },
    { name: 'Riwayat', href: '/riwayat' },
  ]

  const getIsActive = (linkName: string, href: string) => {
    if (linkName === 'Penilaian') {
      return ['/penilaian', '/kelas', '/mapel', '/materi', '/menu', '/murid'].some(p => pathname.startsWith(p))
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <ChefHat className="w-6 h-6 text-primary" />
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
                CuliTrack
              </Link>
            </div>
            {/* Desktop Nav */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.name, link.href)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex">
              <LogoutButton />
            </div>
            
            {/* Mobile menu sheet */}
            <div className="flex items-center sm:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gray-900">
                    <span className="sr-only">Buka menu utama</span>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left mb-6">
                    <SheetTitle className="flex items-center space-x-2">
                      <ChefHat className="w-5 h-5 text-primary" />
                      <span>CuliTrack Guru</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => {
                      const isActive = getIsActive(link.name, link.href)
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {link.name}
                        </Link>
                      )
                    })}
                    <div className="pt-6 border-t mt-6">
                      <LogoutButton className="w-full" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
