import { CalendarClock, CircleCheck, X } from 'lucide-react'
export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return <div className="notifications" role="dialog" aria-label="Уведомления"><div className="panel-heading"><div><strong>Уведомления</strong><span>2 новых</span></div><button className="icon-button" onClick={onClose} aria-label="Закрыть уведомления"><X size={18} /></button></div><button className="notification-item"><span className="notice-icon"><CalendarClock size={17} /></span><span><strong>Освободилось окно в 13:30</strong><small>Кабинет УЗИ · сегодня</small></span><i /></button><button className="notification-item"><span className="notice-icon notice-icon--blue"><CircleCheck size={17} /></span><span><strong>Анна подтвердила запись</strong><small>Первичный приём · 09:00</small></span></button><button className="notifications-all" onClick={onClose}>Отметить все как прочитанные</button></div>
}
