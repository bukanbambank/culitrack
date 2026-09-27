'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from './LogoutButton'
import { Menu, X } from 'lucide-react'

export function NavbarAdmin() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Kelola Guru', href: '/admin/guru' },
    { name: 'Kelola Kelas & Murid', href: '/admin/kelas-murid' },
    { name: 'Kelola Mapel & Materi', href: '/admin/mapel' },
    { name: 'Riwayat', href: '/admin/riwayat' },
  ]

  const getIsActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                CuliTrack <span className="text-xs ml-2 text-gray-500 bg-gray-100 px-2 py-1 rounded">Admin</span>
              </Link>
            </div>
            {/* Desktop Nav */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.href)
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-sage-500 text-sage-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden sm:flex">
              <LogoutButton />
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sage-500"
              >
                <span className="sr-only">Buka menu utama</span>
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href)
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? 'bg-sage-50 border-sage-500 text-sage-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
            <div className="pl-3 pr-4 py-3 border-t">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
