import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
            secondary: "bg-[var(--input-bg)] text-[var(--text-primary)] hover:bg-[var(--sidebar-active)]",
            outline: "border border-[var(--border-color)] bg-transparent hover:bg-[var(--input-bg)] text-[var(--text-primary)]",
            ghost: "hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus-visibility:outline-none focus-visibility:ring-2 focus-visibility:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
