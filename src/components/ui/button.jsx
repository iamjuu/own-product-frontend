import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7622] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none cursor-pointer',
  {
    variants: {
      variant: {
        // Solid Orange Button (Matching "EXPLORE PRODUCTS")
        default:
          'bg-[#FF7622] text-white shadow-md shadow-[#FF7622]/20 hover:bg-[#E56314] hover:shadow-lg hover:shadow-[#FF7622]/30 border border-transparent',
        // Bordered White Button (Matching "BROWSE SHOP")
        outline:
          'border border-stone-300 bg-white text-[#181C2E] hover:border-[#FF7622] hover:text-[#FF7622] hover:bg-orange-50/20 shadow-2xs',
        secondary:
          'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-transparent',
        ghost:
          'hover:bg-orange-50/40 text-slate-700 hover:text-[#FF7622]',
        link:
          'text-[#FF7622] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 px-4 py-2 text-xs rounded-lg',
        lg: 'h-12 px-8 py-3.5 text-sm rounded-xl',
        pill: 'h-11 px-6 py-3 rounded-full',
        icon: 'h-10 w-10 p-0 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
