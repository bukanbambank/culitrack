export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-sage-100 border-t-sage-600 animate-spin"></div>
        <p className="text-sage-700 font-medium animate-pulse">Memuat data...</p>
      </div>
    </div>
  )
}
