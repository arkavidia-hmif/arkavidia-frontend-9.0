import * as React from "react"
import { Button as RadixButton, ButtonProps as RadixButtonProps } from "./ui/button"
import { cn } from "~/lib/utils"
import { cva } from "class-variance-authority"

const ButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-semibold disabled:opacity-100",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white " +
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] transition-shadow duration-300 ease-out " +
          "focus:border-[#CE6AFF] focus:outline-none focus:border-[2px] focus:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "active:bg-[#CE6AFF]/50 active:bg-none active:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white disabled:shadow-none",
        ghost:
          "bg-primary text-white " +
          "hover:bg-gray-800 transition-all duration-300 ease-out " +
          "focus:outline-none focus:bg-gray-800 focus:border focus:border-2 focus:border-gray-700 " +
          "active:bg-gray-700 " +
          "disabled:bg-[#CCCCCC] disabled:text-white ",
        outline:
          "border-2 border-transparent text-transparent bg-clip-text " +
          "after:rounded-md bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] " + 
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] hover:border-[#CE6AFF] transition-all duration-300 ease-out " +
          "focus:outline-none focus:border-[#CE6AFF] focus:shadow-[0px_4px_15px_0px_#CE6AFF] " + 
          "active:bg-none active:text-white active:bg-clip-border active:bg-[#CE6AFF]/50 " +
          "disabled:text-[#CCCCCC] disabled:border-[#CCCCCC] disabled:cursor-not-allowed disabled:shadow-none", 
        secondary:
          "bg-[#CE6AFF] text-white " +
          "hover:bg-[#A555CC] transition-color duration-300 ease-out " +
          "focus:outline-none focus:border focus:border-2 focus:border-[#E2A6FF] " +
          "active:bg-[#522A66] " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white ",
        destructive:
          "bg-red-500 text-white " +
          "hover:bg-red-400 transition-color duration-300 ease-out " +
          "focus:outline-none focus:bg-red-600 focus:border focus:border-2 focus:border-red-400 " +
          "active:bg-red-700 " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white ",
        link:
          "text-white bg-none underline-offset-4 " +
          "hover:underline active:underline " +
          "disabled:cursor-not-allowed",
      },
      size: {
        default: "h-9 px-4 py-2",
        xl: "w-[197px] h-[56px] px-[32px] py-[16px] min-w-[96px] text-lg",
        lg: "w-[173px] h-[52px] px-[20px] py-[14px] min-w-[64px] text-base",
        md: "w-[165px] h-[48px] px-[16px] py-[12px] min-w-[56px] text-base",
        sm: "w-[161px] h-[44px] px-[14px] py-[10px] min-w-[48px] text-sm",
        xs: "w-[157px] h-[40px] px-[12px] py-[8px] min-w-[42px] text-xs",
        icon: "w-4 h-3 test-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends Omit<RadixButtonProps, 'size' | 'variant'> {
  size?: "default" | "sm" | "lg" | "icon" | "xl" | "md" | "xs" | undefined | null
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined | null
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant , size = "default", ...props }, ref) => {

    const inlineStyle =
      variant === "outline"
        ? {
          border: "2px solid transparent",
          borderImageSource:
            "linear-gradient(113.98deg, #48E6FF -34.84%, #9274FF 45.46%, #C159D8 125.76%)",
          borderImageSlice: 1,
          clipPath: "inset(0 round 4px)",
          // If disabled, remove the border image
          ...(props.disabled && { borderImageSource: "none", border: "2px solid #CCCCCC" }),
        }
        : undefined

    return (
      <RadixButton
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        {...props}
        variant={undefined}
        style={inlineStyle}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, ButtonVariants }