import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Database,
  FileText,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  FileBox,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: Database },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/exceptions', label: 'Exceptions', icon: AlertTriangle },
  { to: '/chat', label: 'Ask Invoices', icon: MessageSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="flex w-64 flex-shrink-0 flex-col bg-navy-800 text-white">
        <div className="flex items-center gap-3 border-b border-navy-700 px-6 py-5">
          <FileBox className="h-8 w-8 text-primary-400" />
          <div>
            <h1 className="text-sm font-bold tracking-wide">AgentForge</h1>
            <p className="text-xs text-navy-300">AI Document Ops</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-navy-200 hover:bg-navy-700 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-navy-700 px-6 py-4">
          <p className="text-xs text-navy-400">v1.0.0</p>
          <p className="text-xs text-navy-400">Synthetic Documents Only</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
