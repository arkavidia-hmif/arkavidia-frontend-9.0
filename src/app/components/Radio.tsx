'use client'
import React from 'react'
import { RadioGroup as RadixRadioGroup, RadioGroupItem as RadixRadioGroupItem } from '~/app/components/ui/radio-group'
import { cn } from '~/lib/utils'
import { Label } from './ui/label'


// Interfaces
interface RadioGroupProps extends Omit<React.ComponentProps<typeof RadixRadioGroup>, 'as'> {
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<typeof RadixRadioGroupItem>, 'as'> {
    labelPosition?: 'left' | 'right',
    labelClassName?: string
}


/**
 * Radio group definition
 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup
      ref={ref}
      className={cn("grid gap-4 p-4 ", className)}
      {...props}
    />
  )
})

RadioGroup.displayName = "RadioGroup"

/**
 * Radio input item definition
 * Automatically adds a label to the radio input
 * @param labelPosition - position of the label relative to the radio input: 'left' | 'right'
 * @param labelClassName - class name for the label
 * @param className - class name for the radio input
 */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroupItem>,
  RadioGroupItemProps
>(({ className, id,
           labelPosition = 'right', labelClassName, ...props },
            ref) => {
  return (
    <div className="flex flex-row gap-2">
      {labelPosition === 'left' && <Label htmlFor={id} className={cn(labelClassName, props.disabled && 'opacity-50')}>{props.children}</Label>}
      <RadixRadioGroupItem
        ref={ref}
        className={cn(
          "aspect-square border-none ring-2 ring-purple-400 shadow focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed",
          "text-purple-400 hover:bg-primary hover:outline-purple-500 active:bg-primary active:outline-purple-200 active:outline-2 data-[state=checked]:bg-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent",
          className
        )}
        id = {id}
        {...props}
      >
      </RadixRadioGroupItem>
      {labelPosition === 'right' && <Label htmlFor={id} className={cn(labelClassName, props.disabled && 'opacity-50')}>{props.children}</Label>}
    </div>
  );
});

/**
 * Example of usage
 * <RadioGroup defaultValue="comfortable">
 * <RadioGroupItem value="default" id="r1" labelPosition='left' className="text-xl w-12 h-12" labelClassName="text-xl"> <em>Button 1</em></RadioGroupItem>
 *  RadioGroupItem value="test" id="r2" >Button 2</RadioGroupItem>
 * </RadioGroup>
 */



export default {RadioGroup, RadioGroupItem}