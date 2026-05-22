import type { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base =
    'wobbly-pill border-[3px] border-[var(--border-color)] px-6 py-2.5 font-body text-lg transition-all cursor-pointer';

  const variants: Record<ButtonVariant, string> = {
    primary: [
      'bg-[var(--background)] text-[var(--foreground)]',
      'shadow-[4px_4px_0px_0px_var(--shadow-color)]',
      'hover:bg-[var(--accent)] hover:text-white',
      'hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]',
      'hover:translate-x-[2px] hover:translate-y-[2px]',
      'active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
    ].join(' '),
    secondary: [
      'bg-[var(--muted)] text-[var(--foreground)]',
      'shadow-[4px_4px_0px_0px_var(--shadow-color)]',
      'hover:bg-[var(--accent-blue)] hover:text-white',
      'hover:shadow-[2px_2px_0px_0px_var(--shadow-color)]',
      'hover:translate-x-[2px] hover:translate-y-[2px]',
      'active:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
    ].join(' '),
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
