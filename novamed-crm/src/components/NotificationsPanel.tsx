import { CalendarClock, CircleCheck, X } from 'lucide-react'
import { useEffect } from 'react'
export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest('.notifications, .notification-button')) return
      onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return <div className={`notifications ${open ? 'is-open' : ''}`} role="dialog" aria-label="Уведомления" aria-hidden={!open}><div className="panel-heading"><div><strong>Уведомления</strong><span>2 новых</span></div><button className="icon-button" onClick={onClose} aria-label="Закрыть уведомления"><X size={18} /></button></div><button className="notification-item"><span className="notice-icon"><CalendarClock size={17} /></span><span><strong>Освободилось окно в 13:30</strong><small>Кабинет УЗИ · сегодня</small></span><i /></button><button className="notification-item"><span className="notice-icon notice-icon--blue"><CircleCheck size={17} /></span><span><strong>Анна подтвердила запись</strong><small>Первичный приём · 09:00</small></span></button><button className="notifications-all" onClick={onClose}>Отметить все как прочитанные</button></div>
}
