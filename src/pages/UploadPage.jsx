import { useState, useCallback } from 'react'
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { uploadDocuments } from '../services/documentService'

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback((fileList) => {
    const pdfs = Array.from(fileList).filter((f) => f.type === 'application/pdf')
    const rejected = Array.from(fileList).filter((f) => f.type !== 'application/pdf')
    if (rejected.length > 0) {
      setError(`${rejected.length} non-PDF file(s) rejected. Only PDF files are accepted.`)
    } else {
      setError(null)
    }
    setFiles((prev) => [...prev, ...pdfs])
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)
    setError(null)
    setResult(null)

    const formData = new FormData()
    files.forEach((f) => formData.append('files', f))

    try {
      const res = await uploadDocuments(formData, (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
      })
      setResult(res)
      setFiles([])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="mt-1 text-sm text-gray-500">Upload synthetic hospital invoice PDFs for processing</p>
      </div>

      <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-warning-600" />
          <div>
            <p className="text-sm font-medium text-warning-800">Use synthetic documents only.</p>
            <p className="mt-1 text-sm text-warning-700">
              Each upload is automatically extracted, OCR-processed when needed, validated, stored,
              chunked, and indexed into the vector database.
            </p>
          </div>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition ${
          dragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'
        }`}
      >
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm font-medium text-gray-700">Drag and drop PDF files here</p>
        <p className="text-xs text-gray-500">or</p>
        <label className="mt-2 inline-block">
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="cursor-pointer rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400">
            Browse Files
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 p-4">
          <AlertCircle className="h-5 w-5 text-danger-500" />
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Selected Files ({files.length})</h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary-600" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  disabled={uploading}
                  className="text-gray-400 transition hover:text-danger-500 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
          >
            {uploading ? `Uploading... ${progress}%` : `Upload ${files.length} File(s)`}
          </button>
          {uploading && (
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-success-600" />
            <div>
              <p className="text-sm font-medium text-success-800">{result.message}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <p className="text-xs text-success-700">Uploaded: {result.uploaded}</p>
                <p className="text-xs text-success-700">Processed: {result.processed}</p>
                <p className="text-xs text-success-700">Duplicates: {result.duplicates}</p>
                <p className="text-xs text-success-700">Failed: {result.failed}</p>
              </div>
              {result.documents && result.documents.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {result.documents.map((d) => (
                    <li key={d.id} className="text-xs text-gray-600">
                      {d.file_name} — <span className="font-medium">{d.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
