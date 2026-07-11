import { useState } from 'react'

interface AvatarProps { name: string; src?: string; size: number; className?: string }

export function Avatar({ name, src, size, className = '' }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  const showImage = Boolean(src && failedSrc !== src)

  return <span className={`avatar ${className}`} style={{ width: size, height: size }} aria-hidden="true">
    {showImage ? <img src={src} alt="" onError={() => setFailedSrc(src ?? null)} /> : <span>{initials}</span>}
  </span>
}
