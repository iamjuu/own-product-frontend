import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-[#FF7622] text-white shadow-2xs',
        outline: 'border border-stone-300 text-stone-700 bg-white',
        peach: 'bg-[#FFD7C7]/70 text-[#C84A20] border border-[#FF7622]/15',
        secondary: 'bg-slate-100 text-slate-800',
        destructive: 'bg-rose-500 text-white',
        success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
