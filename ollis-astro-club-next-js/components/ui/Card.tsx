import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  rotate?: boolean;
}

export function Card({ children, className = '', rotate = false }: CardProps) {
  const rotateClass = rotate ? 'hover:rotate-1 -rotate-[0.5deg]' : '';

  return (
    <div
      className={`wobbly border-[3px] border-[var(--border-color)] bg-[var(--background)] p-5 shadow-[4px_4px_0px_0px_var(--shadow-color)] transition-all hover:shadow-[6px_6px_0px_0px_var(--shadow-color)] ${rotateClass} ${className}`}
    >
      {children}
    </div>
  );
}
