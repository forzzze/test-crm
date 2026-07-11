import { Lightbulb, LightbulbOff } from 'lucide-react'
import type { Theme } from '../types'

export function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const isDark = theme === 'dark'
  return <button className="theme-toggle" type="button" role="switch" aria-checked={isDark} aria-label={`Включить ${isDark ? 'светлую' : 'тёмную'} тему`} onClick={() => onChange(isDark ? 'light' : 'dark')}>
    <span className="theme-icon theme-icon--off"><LightbulbOff size={14} /></span>
    <span className="theme-icon theme-icon--on"><Lightbulb size={14} /></span>
    <span className="theme-toggle-thumb" aria-hidden="true" />
  </button>
}
