import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
