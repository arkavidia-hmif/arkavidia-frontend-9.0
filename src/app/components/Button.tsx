"use client";

import * as React from "react";
import { Button as RadixButton, ButtonProps as RadixButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";
import { cva } from "class-variance-authority";

const ButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-semibold disabled:opacity-100",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white " +
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] transition-all duration-300 ease-out " +
          "focus:outline-none focus:border-[2px] focus:border-[#CE6AFF] focus:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "active:bg-gradient-to-r active:from-[#3BB8CC] active:via-[#745CC8] active:to-[#9A47AD] " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white disabled:shadow-none",
        ghost:
          "dark:bg-gray-900 dark:text-white bg-gray-50 text-black " +
          "hover:bg-gray-700 transition-all duration-300 ease-out " +
          "focus:outline-none focus:bg-gray-600 focus:border focus:border-2 focus:border-gray-400 " +
          "active:bg-gray-600 active:border-gray-400 " +
          "disabled:bg-[#CCCCCC] disabled:text-white ",
        outline:
          "bg-transparent " +
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] hover:bg-transparent transition-shadow duration-300 ease-out " +
          "focus:outline-none focus:bg-transparent focus:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "active:bg-gradient-to-r active:from-[#48E6FF] active:via-[#9274FF] active:to-[#C159D8] active:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "disabled:bg-transparent disabled:cursor-not-allowed disabled:shadow-none ",
        secondary:
          "bg-[#CE6AFF] text-white " +
          "hover:bg-[#A555CC] transition-color duration-300 ease-out " +
          "focus:outline-none focus:border focus:border-2 focus:border-[#E2A6FF] " +
          "active:bg-[#522A66] " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white ",
        destructive:
          "bg-red-500 text-white " +
          "hover:bg-red-600 transition-color duration-300 ease-out " +
          "focus:outline-none focus:bg-red-600 focus:border focus:border-2 focus:border-red-400 " +
          "active:bg-red-700 active:border-0 " +
          "disabled:bg-gray-400 disabled:text-white ",
        link:
          "bg-transparent underline-offset-[5px] hover:underline hover:bg-transparent active:underline " +
          "disabled:text-gray-400 disabled:underline mix-blend-difference text-black dark:text-white",
      },
      size: {
        default: "text-xs sm:text-sm md:text-base",
        xl: "text-sm sm:text-base md:text-lg lg:text-xl",
        lg: "text-xs sm:text-sm md:text-base",
        md: "text-xs sm:text-sm md:text-base",
        sm: "text-xs sm:text-sm",
        xs: "text-xs",
        icon: "text-xs sm:text-sm md:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const sizeVariants = cva(
  "sm:min-h-[44px] sm:!px-[14px] sm:!py-[10px] sm:text-sm md:min-h-[48px] md:!px-[16px] md:!py-[12px] md:text-base lg:min-h-[52px] lg:!px-[20px] lg:!py-[14px]",
  {
    variants: {
      size: {
        default: "sm:min-h-[44px] sm:!px-[14px] sm:!py-[10px] sm:text-sm md:min-h-[48px] md:!px-[16px] md:!py-[12px] md:text-base lg:min-h-[52px] lg:!px-[20px] lg:!py-[14px]",
        xl: "sm:min-h-[48px] sm:!px-[24px] sm:!py-[12px] sm:text-base md:min-h-[52px] md:!px-[28px] md:!py-[14px] md:text-lg lg:min-h-[56px] lg:!px-[32px] lg:!py-[16px] lg:text-xl",
        lg: "sm:min-h-[48px] sm:!px-[16px] sm:!py-[12px] sm:text-sm md:min-h-[52px] md:!px-[20px] md:!py-[14px] md:text-base",
        md: "sm:min-h-[44px] sm:!px-[14px] sm:!py-[10px] sm:text-sm md:min-h-[48px] md:!px-[16px] md:!py-[12px] md:text-base",
        sm: "sm:min-h-[40px] sm:!px-[12px] sm:!py-[8px] sm:text-xs md:min-h-[44px] md:!px-[14px] md:!py-[10px] md:text-sm",
        xs: "min-h-[36px] !px-[10px] !py-[6px] text-xs sm:min-h-[40px] sm:!px-[12px] sm:!py-[8px]",
        icon: "w-8 h-8 !p-1.5 sm:w-9 sm:h-9 sm:!p-2 md:w-10 md:h-10 md:!p-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface ButtonProps extends Omit<React.ComponentProps<typeof RadixButton>, "size" | "variant"> {
  size?: "default" | "sm" | "lg" | "icon" | "xl" | "md" | "xs" | undefined | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size = "default", ...props }, ref) => {
    const [isActive, setIsActive] = React.useState(false);

    if (variant === "outline") {
      return (
        <RadixButton
          ref={ref}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onMouseLeave={() => setIsActive(false)}
          className={cn(ButtonVariants({ variant, size, className }), sizeVariants({ size }))}
          {...props}
        >
          <div className={cn(
            'absolute inset-0 border-2 rounded-md [clip-path:inset(0_round_5px)]',
            props.disabled
              ? 'border-gray-400'
              : '[border-image:linear-gradient(to_right,#48E6FF,#9274FF)_1] active:transition-colors active:duration-100 active:ease-out'
          )}>
          </div>
          <div
            className={cn(
              "relative bg-clip-text text-transparent flex items-center justify-center h-full w-full",
              isActive ? "bg-white" : "bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8]",
              props.disabled && "!text-gray-400"
            )}
          >
            {props.children}
          </div>
        </RadixButton>
      )
    }

    return (
      <RadixButton
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }), sizeVariants({ size }))}
        {...props}
      >
        {props.children}
      </RadixButton>
    )
  }
);

Button.displayName = "Button";

export { Button, ButtonVariants };