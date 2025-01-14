'use client'


import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'

import { cn } from '~/lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    checked?: boolean | 'indeterminate'
    text?: React.ReactNode
    textclassName?: string
  }
>(({ className, checked, text, textclassName, ...props }, ref) => (
  <label className="flex items-center space-x-2">
    <CheckboxPrimitive.Root
      ref={ref}
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      className={cn(
        'peer h-6 w-6 shrink-0 rounded-lg border-[1.5px] border-lilac-500 border-primary font-normal ring-offset-background transition-all duration-150 ease-linear focus:shadow-[0_0_0_3px_rgba(255,166,255,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-lilac-500 data-[state=checked]:bg-primary data-[state=unchecked]:bg-transparent data-[state=checked]:text-primary-foreground data-[state=unchecked]:hover:bg-lilac-100',
        className
      )}
      checked={checked === 'indeterminate' ? true : checked}
      {...props}>
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current')}>
        {checked === 'indeterminate' ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {text && (
      <span
        className={cn(
          'font-dmsans text-xl font-normal text-lilac-100',
          textclassName
        )}>
        {text}
      </span>
    )}
  </label>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
