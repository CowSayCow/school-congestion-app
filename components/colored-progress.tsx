"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ColoredProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  level: "low" | "medium" | "high"
}

const ColoredProgress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ColoredProgressProps>(
  ({ className, value, level, ...props }, ref) => {
    const getProgressColor = (level: string) => {
      switch (level) {
        case "low":
          return "bg-blue-500"
        case "medium":
          return "bg-yellow-500"
        case "high":
          return "bg-red-500"
        default:
          return "bg-gray-500"
      }
    }

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 transition-all", getProgressColor(level))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  },
)
ColoredProgress.displayName = ProgressPrimitive.Root.displayName

export { ColoredProgress }
