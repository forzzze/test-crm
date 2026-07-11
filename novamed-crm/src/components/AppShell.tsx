import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
export function AppShell({ active, onNavigate, children }: { active: string; onNavigate: (label: string) => void; children: ReactNode }) { return <div className="app-shell"><Sidebar active={active} onNavigate={onNavigate} /><div className="app-content">{children}</div></div> }
