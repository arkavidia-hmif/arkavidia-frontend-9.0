"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "~/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    disabled={props.disabled}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed data-[state=checked]:bg-lilac-500 data-[state=unchecked]:bg-blue-100",
      className
    )}
    style={{
      backgroundColor: props.disabled ? '#595959' : 'none',
    }}
    {...props}
    ref={ref}
    onCheckedChange={props.onCheckedChange}
  >
    <SwitchPrimitives.Thumb
      style={{
        backgroundColor: props.disabled ? '#CCCCCC' : '#16326D',
      }}
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-logo-shadow data-[state=unchecked]:translate-x-0")}
    >
      <div className="w-full h-full">
        {props.checked ? (
          <img
            src="/Logo.svg"
            alt="Checked"
            className="w-15 h-15 object-contain peer-disabled:filter-grayscale"
            style={{ transform: 'translate(0.2%, -32%)',
              filter: props.disabled ? 'brightness(9) contrast(0.7)' : 'drop-shadow(-4px 0px 8px rgba(0, 0, 0, 0.7))',
            }}
          />
        ) : (
          <img
            src="/Logo.svg"
            alt="Unchecked"
            className="w-15 h-15 object-contain"
            style={{ transform: 'translate(0%, -32%)',
              filter:props.disabled ? 'brightness(9) contrast(0.7)' : 'none',
            }} 
          />
        )}
      </div>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }