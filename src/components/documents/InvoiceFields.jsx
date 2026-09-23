import { AlertCircle, CheckCircle } from 'lucide-react'

export default function InvoiceFields({ header }) {
  if (!header) return null

  const fields = [
    { label: 'Invoice Number', value: header.invoice_no },
    { label: 'Hospital Name', value: header.hospital_name },
    { label: 'Patient Name', value: header.patient_name },
    { label: 'Patient ID', value: header.patient_id },
    { label: 'Invoice Date', value: header.invoice_date },
    { label: 'Insurer', value: header.insurer },
    { label: 'Diagnosis', value: header.diagnosis },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => {
        const isMissing = !field.value || field.value === ''
        return (
          <div
            key={field.label}
            className={`rounded-lg border p-4 ${
              isMissing ? 'border-danger-300 bg-danger-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {isMissing ? (
                <AlertCircle className="h-4 w-4 text-danger-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-success-500" />
              )}
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {field.label}
              </p>
            </div>
            <p className={`mt-1 text-sm font-medium ${isMissing ? 'text-danger-600' : 'text-gray-900'}`}>
              {isMissing ? 'Missing' : field.value}
            </p>
          </div>
        )
      })}
    </div>
  )
}
