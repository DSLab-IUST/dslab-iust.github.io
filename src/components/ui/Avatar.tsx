import { cn } from '@/lib/cn';
import { initialsOf } from '@/lib/format';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  ring?: boolean;
  className?: string;
}

/** Falls back to initials rather than a generic person glyph, per DESIGN.md §5.7. */
export function Avatar({ name, src, size = 'md', ring = false, className }: AvatarProps) {
  return (
    <span className={cn('avatar', `avatar-${size}`, ring && 'avatar-ring', className)}>
      {src ? <img src={src} alt={name} loading="lazy" decoding="async" /> : initialsOf(name)}
    </span>
  );
}
