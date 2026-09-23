import { useState, useRef, useEffect } from 'react'
import { Send, Info } from 'lucide-react'
import ChatMessage from '../components/chat/ChatMessage'
import { sendChatQuery } from '../services/chatService'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    setError(null)
    try {
      const res = await sendChatQuery(question)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.answer, citations: res.citations || [] },
      ])
    } catch (err) {
      setError(err.message)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I encountered an error while searching. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ask Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">Ask questions about invoice data with cited evidence</p>
      </div>

      <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 flex-shrink-0 text-primary-600" />
          <p className="text-sm text-primary-800">
            Search covers every successfully indexed PDF from both the bulk folder and UI uploads.
            Every answer includes citation cards linking to the source document.
          </p>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-gray-200 bg-white" style={{ height: '60vh' }}>
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-sm text-gray-400">Ask a question about your invoices.</p>
                <p className="mt-1 text-xs text-gray-400">e.g., "What is the total for INV-100001?" or "Who is the patient for invoice 3?"</p>
              </div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-4">
          {error && <p className="mb-2 text-xs text-danger-600">{error}</p>}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your invoices..."
              disabled={loading}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
