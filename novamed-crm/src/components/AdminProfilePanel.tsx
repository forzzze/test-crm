import { Building2, Clock3, Mail, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function AdminProfilePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('button')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return <div className="profile-layer">
    <button className="profile-overlay" onClick={onClose} aria-label="Закрыть карточку профиля" />
    <aside ref={panelRef} className="admin-profile-card" role="dialog" aria-modal="true" aria-labelledby="admin-profile-title">
      <div className="admin-profile-head">
        <span className="admin-profile-avatar">МВ</span>
        <div><span className="admin-profile-online"><i />На смене</span><h2 id="admin-profile-title">Марина Волкова</h2><p>Администратор клиники</p></div>
        <button className="icon-button" onClick={onClose} aria-label="Закрыть профиль"><X size={18} /></button>
      </div>
      <div className="admin-profile-access"><ShieldCheck size={17} /><div><strong>Полный доступ</strong><span>Управление записями и пациентами</span></div></div>
      <dl className="admin-profile-details">
        <div><dt><Building2 size={16} />Филиал</dt><dd>NovaMed · Центральный</dd></div>
        <div><dt><Clock3 size={16} />Рабочая смена</dt><dd>08:00–20:00</dd></div>
        <div><dt><Mail size={16} />Почта</dt><dd><a href="mailto:m.volkova@novamed.ru">m.volkova@novamed.ru</a></dd></div>
      </dl>
      <div className="admin-profile-footer"><span>ID сотрудника: NM-014</span><button className="button button--secondary" onClick={onClose}>Закрыть</button></div>
    </aside>
  </div>
}
