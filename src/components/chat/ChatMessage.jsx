import { User, Bot } from 'lucide-react'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-primary-600' : 'bg-navy-700'
        }`}
      >
        {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>
      <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm ${
            isUser ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          {message.content}
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 space-y-2 text-left">
            <p className="text-xs font-medium text-gray-500">Sources:</p>
            {message.citations.map((citation, idx) => (
              <CitationCard key={idx} citation={citation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { FileText, Hash, File } from 'lucide-react'

function CitationCard({ citation }) {
  return (
    <Link
      to={`/documents/${citation.document_id}`}
      className="block rounded-lg border border-gray-200 bg-gray-50 p-3 transition hover:border-primary-300 hover:bg-primary-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-gray-900">{citation.invoice_no}</span>
        </div>
        <span className="text-xs text-gray-500">Page {citation.page_number}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><File className="h-3 w-3" />{citation.file_name}</span>
        <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{citation.chunk_id}</span>
      </div>
      <p className="mt-2 rounded bg-white px-2 py-1 text-xs italic text-gray-600 border border-gray-200">
        "{citation.snippet}"
      </p>
    </Link>
  )
}
