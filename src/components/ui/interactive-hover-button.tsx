import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-button bg-accent px-6 py-3 font-medium text-white shadow-sm transition-[background-color,box-shadow,transform] duration-md ease-out-smooth hover:bg-accentDeep active:scale-[0.97]",
        className
      )}
      {...props}
    >
      {children}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  )
}
