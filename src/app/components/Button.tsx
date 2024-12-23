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
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] transition-shadow duration-300 ease-out " +
          "focus:outline-none focus:border-[2px] focus:border-[#CE6AFF] focus:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "active:bg-[#CE6AFF] active:bg-none active:shadow-[0px_4px_15px_0px_#CE6AFF] active:text-white " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white disabled:shadow-none",
        ghost:
          "dark:bg-gray-900 dark:text-white bg-gray-50 text-black " +
          "hover:bg-gray-700 transition-all duration-300 ease-out " +
          "focus:outline-none focus:bg-gray-600 focus:border focus:border-2 focus:border-gray-400 " +
          "active:bg-gray-600 active:border-gray-400 " +
          "disabled:bg-[#CCCCCC] disabled:text-white ",
        outline:
          "px-0 py-0 bg-transparent " +
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
        default: "min-h-[52px] !px-[20px] !py-[14px] text-lg",
        xl: "min-h-[56px] !px-[32px] !py-[16px] text-xl whitespace-normal",
        lg: "min-h-[52px] !px-[20px] !py-[14px] text-lg",
        md: "min-h-[48px] !px-[16px] !py-[12px] text-base whitespace-normal",
        sm: "min-h-[44px] !px-[14px] !py-[10px] text-sm whitespace-normal",
        xs: "min-h-[40px] !px-[12px] !py-[8px] text-xs whitespace-normal",
        icon: "w-10 h-10 !p-2.5 whitespace-normal",
      },

    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const sizeVariants = cva(
  "min-h-[52px] !px-[20px] !py-[14px] text-lg",
  {
    variants: {
      size: {
        default: "min-h-[52px] !px-[20px] !py-[14px] text-lg",
        xl: "min-h-[56px] !px-[32px] !py-[16px] text-xl whitespace-normal",
        lg: "min-h-[52px] !px-[20px] !py-[14px] text-lg",
        md: "min-h-[48px] !px-[16px] !py-[12px] text-base whitespace-normal",
        sm: "min-h-[44px] !px-[14px] !py-[10px] text-sm whitespace-normal",
        xs: "min-h-[40px] !px-[12px] !py-[8px] text-xs whitespace-normal",
        icon: "w-10 h-10 !p-2.5 whitespace-normal",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)


interface ButtonProps extends Omit<RadixButtonProps, "size" | "variant"> {
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
          className={cn(ButtonVariants({ variant, size, className }), '!px-0 !py-0')}
          {...props}
        >
          <div className={cn(
            sizeVariants({ size }),
            'h-full w-full border-2 [clip-path:inset(0_round_5px)]',
            props.disabled
              ? 'border-gray-400'
              : '[border-image:linear-gradient(to_right,#48E6FF,#9274FF)_1] active:transition-colors active:duration-100 active:ease-out'
          )}>
            <div
              className={cn(
                "relative bg-clip-text text-transparent flex items-center justify-center h-full",
                isActive ? "bg-white" : "bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8]",
                props.disabled && "!text-gray-400"
              )}
            >
              {props.children}
            </div>
          </div>
        </RadixButton>
      )
    }

    return (
      <RadixButton
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        {...props}
      >
        {props.children}
      </RadixButton>
    )
  }
);

Button.displayName = "Button";

export { Button, ButtonVariants };
