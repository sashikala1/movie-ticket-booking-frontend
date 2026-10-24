import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
  const styles = {
    primary: 'bg-red-600 text-white hover:bg-red-500',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
    danger: 'bg-red-700 text-white hover:bg-red-600',
  };

  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
