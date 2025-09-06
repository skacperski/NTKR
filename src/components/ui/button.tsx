// Reusable Button component following NTKR design principles

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles - minimalist, no rounded corners
          'inline-flex items-center justify-center font-mono font-bold uppercase tracking-wide',
          'border transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          {
            'bg-black text-white border-black hover:bg-gray-800': variant === 'default',
            'bg-white text-black border-gray-300 hover:bg-gray-50': variant === 'outline',
            'bg-transparent text-black border-transparent hover:bg-gray-100': variant === 'ghost',
          },
          
          // Sizes
          {
            'px-3 py-2 text-xs': size === 'sm',
            'px-4 py-3 text-sm': size === 'md',
            'px-6 py-4 text-base': size === 'lg',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
