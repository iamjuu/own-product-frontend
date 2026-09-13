import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border bg-white p-4 text-xs transition-all shadow-sm [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "border-slate-200/80 text-[#181829] [&>svg]:text-[#181829]",
        destructive:
          "border-rose-200/80 text-[#181829] [&>svg]:text-rose-600 bg-rose-50/30",
        success:
          "border-emerald-200/80 text-[#181829] [&>svg]:text-emerald-600 bg-emerald-50/30",
        info:
          "border-purple-200/80 text-[#181829] [&>svg]:text-[#6339f4] bg-[#ece8ff]/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight text-xs text-[#181829]", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed text-[#8a87a6] font-normal mt-0.5", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

