'use client'

import { Check, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StepperProps {
  currentStep: number // 1 to 5
}

const steps = ['Kelas', 'Mapel', 'Materi', 'Menu', 'Murid']

export default function Stepper({ currentStep }: StepperProps) {
  const router = useRouter()

  return (
    <div className="w-full mb-8">
      {/* Stepper Bar */}
      <div className="flex items-center justify-between w-full mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isPast = stepNumber < currentStep
          const isActive = stepNumber === currentStep
          const isFuture = stepNumber > currentStep

          return (
            <div key={step} className="flex items-center relative flex-1 last:flex-none">
              {/* Line connector */}
              {index !== steps.length - 1 && (
                <div 
                  className={`absolute top-1/2 left-8 right-0 h-[2px] -translate-y-1/2 ${
                    isPast ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{ width: 'calc(100% - 2rem)', left: '2rem' }}
                />
              )}
              
              {/* Circle */}
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2
                    ${isPast ? 'bg-green-500 border-green-500 text-white' : ''}
                    ${isActive ? 'border-green-500 text-green-600 bg-green-50' : ''}
                    ${isFuture ? 'border-gray-300 text-gray-400 bg-white' : ''}
                  `}
                >
                  {isPast ? <Check size={16} strokeWidth={3} /> : stepNumber}
                </div>
                <span 
                  className={`absolute top-10 text-xs font-medium text-center
                    ${isActive ? 'text-green-600 font-bold' : ''}
                    ${isPast ? 'text-green-500' : ''}
                    ${isFuture ? 'text-gray-400' : ''}
                  `}
                >
                  {step}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mt-8"
      >
        <ArrowLeft size={16} className="mr-1" />
        Kembali
      </button>
    </div>
  )
}
