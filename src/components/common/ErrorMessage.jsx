import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-danger-200 bg-danger-50 px-6 py-8">
      <AlertCircle className="h-8 w-8 text-danger-500" />
      <p className="text-sm font-medium text-danger-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-md bg-danger-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-danger-400"
        >
          Retry
        </button>
      )}
    </div>
  )
}
