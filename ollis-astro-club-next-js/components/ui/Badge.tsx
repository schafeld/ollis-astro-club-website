import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'blue';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--muted)] text-[var(--foreground)] border-[var(--border-color)]',
    accent: 'bg-[var(--accent)] text-white border-[var(--accent)]',
    blue: 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]',
  };

  return (
    <span
      className={`wobbly-sm inline-block border-2 px-3 py-0.5 text-sm font-body ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
