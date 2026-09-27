import { NavbarGuru } from '@/components/NavbarGuru'

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarGuru />
      <main className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
