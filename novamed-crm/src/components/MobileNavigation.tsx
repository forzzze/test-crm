import { useEffect, useRef } from 'react'
import { Sidebar } from './Sidebar'

interface Props { open: boolean; active: string; onNavigate: (label: string) => void; onClose: () => void }
export function MobileNavigation({ open, active, onNavigate, onClose }: Props) {
  const panelRef = useRef<HTMLElement>(null)
  useEffect(() => { if (!open) return; const previous = document.activeElement as HTMLElement; document.body.classList.add('scroll-locked'); panelRef.current?.querySelector<HTMLElement>('button')?.focus(); const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'Tab' && panelRef.current) { const items = [...panelRef.current.querySelectorAll<HTMLElement>('button')]; if (!items.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() } } }; document.addEventListener('keydown', onKey); return () => { document.body.classList.remove('scroll-locked'); document.removeEventListener('keydown', onKey); previous?.focus() } }, [open, onClose])
  if (!open) return null
  return <div className="mobile-nav-layer"><button className="overlay" onClick={onClose} aria-label="Закрыть меню" /><div ref={panelRef as React.RefObject<HTMLDivElement>} className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Меню NovaMed"><Sidebar mobile active={active} onNavigate={onNavigate} onClose={onClose} /></div></div>
}
