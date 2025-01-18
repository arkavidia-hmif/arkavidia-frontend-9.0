'use client'

import * as React from 'react'
import { Input as ShadcnInput } from './ui/input'
import { cn } from '~/lib/utils'
import { cva } from 'class-variance-authority'
import Image from 'next/image'
import SearchIcon from './ui/search-icon'

const InputVariants = cva(
  'flex w-[350px] rounded-[12px] transition duration-200 ease-in-out border-[1.5px] text-base placeholder:text-md ',
  {
    variants: {
      variant: {
        default:
          'border-purple-400 bg-lilac-100 placeholder:font-dmsans font-dmsans placeholder:text-purple-400 placeholder:leading-[24px] placeholder:font-normal leading-[24px] font-normal  text-purple-700  ' +
          'hover:bg-lilac-200 ' +
          'focus-visible:ring-[3px] focus-visible:ring-lilac-200 focus-visible:border-purple-400 ' +
          'disabled:bg-neutral-150 disabled:border-neutral-600 disabled:opacity-100 disabled:placeholder:text-neutral-600',
        unfilled:
          'border-lilac-100 bg-transparent placeholder:font-dmsans font-dmsans placeholder:text-lilac-100 placeholder:leading-[24px] placeholder:font-normal leading-[24px] font-normal text-lilac-100  ' +
          'hover:shadow-[0_0_4px_0_rgba(255,255,255,1)] ' +
          'disabled:border-neutral-600 disabled:placeholder:text-neutral-600 disabled:hover:shadow-none disabled:opacity-100'
      },
      state: {
        default: '',
        success: 'border-green-400 ',
        warning: 'border-yellow-500 ',
        error: 'border-red-500 '
      },
      size: {
        lg: 'h-[48px] max-w-[350px] p-[12px] py-2 ',
        md: 'h-[40px] max-w-[350px] px-[12px] py-[8px] '
      }
    },
    defaultVariants: {
      variant: 'default',
      state: 'default',
      size: 'lg'
    }
  }
)

const IconVariants = cva('absolute top-1/2 -translate-y-1/2 ', {
  variants: {
    state: {
      default: '',
      success: 'text-green-400 ',
      warning: 'text-yellow-500',
      error: 'text-red-500'
    },
    variant: {
      default: '',
      unfilled: ''
    },
    size: {
      lg: 'w-[24px] h-[24px]',
      md: 'w-[24px] h-[24px]'
    },
    position: {
      left: 'left-3',
      right: 'left-[314px]'
    }
  },
  defaultVariants: {
    variant: 'default',
    state: 'default',
    size: 'lg',
    position: 'left'
  },
  compoundVariants: [
    {
      variant: 'default',
      state: 'default',
      className: 'text-purple-400'
    },
    {
      variant: 'unfilled',
      state: 'default',
      className: 'text-lilac-100'
    }
  ]
})

interface InputProps extends Omit<React.ComponentProps<typeof ShadcnInput>, 'size'> {
  size?: 'lg' | 'md' | undefined | null
  variant?: 'default' | 'unfilled' | undefined | null
  state?: 'default' | 'success' | 'warning' | 'error' | undefined | null
  leftIcon?: React.ReactNode | boolean
  rightIcon?: React.ReactNode | boolean
  helperText?: string
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'lg',
      state = 'default',
      leftIcon,
      rightIcon,
      helperText,
      label,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="grid gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              'font-dmsans text-base font-normal leading-[24px]',
              props.disabled && 'text-neutral-600',
              !props.disabled && 'text-white'
            )}>
            {label}
            <span className={cn(props.disabled ? 'text-neutral-600' : 'text-red-500')}>
              {' '}
              *
            </span>
          </label>
        )}
        <div className="relative w-fit">
          {leftIcon && typeof leftIcon === 'object' && (
            <div className={cn(IconVariants({ size, position: 'left' }))}>{leftIcon}</div>
          )}
          {leftIcon && typeof leftIcon === 'boolean' && (
            <SearchIcon
              className={cn(
                IconVariants({ size, position: 'left', state, variant }),
                props.disabled && 'text-neutral-600'
              )}
            />
          )}
          <ShadcnInput
            ref={ref}
            className={cn(
              InputVariants({ variant, size, state }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && typeof rightIcon === 'object' && (
            <div className={cn(IconVariants({ size, position: 'right' }))}>
              {rightIcon}
            </div>
          )}

          {rightIcon && typeof rightIcon === 'boolean' && (
            <SearchIcon
              className={cn(
                IconVariants({ size, position: 'right', state, variant }),
                props.disabled && 'text-neutral-600'
              )}
            />
          )}
        </div>
        {(helperText || error) && (
          <p
            className={cn('text-sm text-lilac-100', {
              'text-red-500': state === 'error',
              'text-green-400': state === 'success',
              'text-yellow-500': state === 'warning',
              'text-neutral-600': props.disabled
            })}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, InputVariants }
