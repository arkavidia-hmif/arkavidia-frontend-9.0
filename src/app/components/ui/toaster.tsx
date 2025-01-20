'use client'

import { useToast } from '~/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '~/app/components/ui/toast'
import { Check, Info, TriangleAlert } from 'lucide-react'
import { X } from 'lucide-react'

function getToastIcon(
  variant: 'success' | 'destructive' | 'warning' | 'info' | null | undefined
) {
  const icons = {
    success: <Check className="h-6 w-6 text-green-400" />,
    destructive: <X className="h-6 w-6 text-red-400" />,
    warning: <TriangleAlert className="h-5 w-5 pb-0.5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-blue-200" />
  }

  if (!variant) {
    return null
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#0B0B0B]/20 p-1">
      {icons[variant]}
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="mt-4">
            <div className="flex items-center gap-x-4">
              {getToastIcon(variant)}
              <div className="grid gap-1">
                {title && <ToastTitle variant={variant}>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
