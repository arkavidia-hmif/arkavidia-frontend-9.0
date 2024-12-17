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
          "active:bg-[#CE6AFF] active:bg-none active:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white disabled:shadow-none",
        ghost:
          "bg-primary text-white " +
          "hover:bg-gray-800 transition-all duration-300 ease-out " +
          "focus:outline-none focus:bg-gray-800 focus:border focus:border-2 focus:border-gray-700 " +
          "active:bg-gray-700 " +
          "disabled:bg-[#CCCCCC] disabled:text-white ",
        outline:
          "px-0 py-0 " +
          "hover:shadow-[0px_4px_15px_0px_#CE6AFF] transition-shadow duration-300 ease-out " +
          "focus:outline-none focus:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "active:bg-[#CE6AFF]/50 active:shadow-[0px_4px_15px_0px_#CE6AFF] " +
          "disabled:text-[#CCCCCC] disabled:cursor-not-allowed disabled:shadow-none ",
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
          "active:bg-red-700 active:border-0 " +
          "disabled:bg-[#CCCCCC] disabled:bg-none disabled:text-white ",
        link:
          "text-white bg-none underline-offset-[5px] " +
          "hover:underline active:underline " +
          "disabled:cursor-not-allowed",
      },
      size: {
        default: "h-[170px] w-[50px] px-[18] py-[16px] min-w-[100px] text-lg",
        xl: "w-[197px] h-[56px] px-[32px] py-[16px] min-w-[96px] text-lg",
        lg: "w-[173px] h-[52px] px-[20px] py-[14px] min-w-[64px] text-base",
        md: "w-[165px] h-[48px] px-[16px] py-[12px] min-w-[56px] text-base",
        sm: "w-[161px] h-[44px] px-[14px] py-[10px] min-w-[48px] text-sm",
        xs: "w-[157px] h-[40px] px-[12px] py-[8px] min-w-[42px] text-xs",
        icon: "w-4 h-3 px-[10px] py-[6px] test-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends Omit<RadixButtonProps, "size" | "variant"> {
  size?: "default" | "sm" | "lg" | "icon" | "xl" | "md" | "xs" | undefined | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | undefined | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size = "default", ...props }, ref) => {
    const [isActive, setIsActive] = React.useState(false);

    const inlineStyles =
      variant === "outline"
        ? {
          border: isActive ? "2px solid #CE6AFF" : "2px solid transparent", // Red border when active
          background: !isActive
            ? "linear-gradient(black, black) padding-box, linear-gradient(113.98deg, #48E6FF -34.84%, #9274FF 45.46%, #C159D8 125.76%) border-box"
            : undefined,
        }
        : {};

    return (
      <RadixButton
        ref={ref}
        className={cn(ButtonVariants({ variant, size, className }))}
        style={inlineStyles}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => setIsActive(false)}
        {...props}
      >
        {variant === "outline" ? (
          <div
            className={`relative bg-clip-text text-transparent  ${
              isActive ? "bg-white" : "bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8]"
            }`}
          >
            {props.children}
          </div>
        ) : (
          props.children
        )}
      </RadixButton>
    );
  }
);

Button.displayName = "Button";

export { Button, ButtonVariants };
