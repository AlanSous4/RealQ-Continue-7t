import * as React from "react"
import { cn } from "@/lib/utils"

const WhiteCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg border bg-white shadow-sm dark:bg-white/95 dark:text-gray-800", className)}
      {...props}
    />
  ),
)
WhiteCard.displayName = "WhiteCard"

const WhiteCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
WhiteCardHeader.displayName = "WhiteCardHeader"

const WhiteCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-900", className)}
      {...props}
    />
  ),
)
WhiteCardTitle.displayName = "WhiteCardTitle"

const WhiteCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-gray-600 dark:text-gray-600", className)} {...props} />
  ),
)
WhiteCardDescription.displayName = "WhiteCardDescription"

const WhiteCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
WhiteCardContent.displayName = "WhiteCardContent"

const WhiteCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
WhiteCardFooter.displayName = "WhiteCardFooter"

export { WhiteCard, WhiteCardHeader, WhiteCardFooter, WhiteCardTitle, WhiteCardDescription, WhiteCardContent }
