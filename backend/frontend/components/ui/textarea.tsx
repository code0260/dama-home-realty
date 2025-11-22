import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs",
        "transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        /* Dark mode styles */
        "dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400",
        "dark:focus-visible:border-secondary dark:focus-visible:ring-secondary/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
