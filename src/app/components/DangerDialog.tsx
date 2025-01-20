import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { Button } from './Button'

export const DangerDialog: React.FC<{
  title: string
  message: string
  actionText: string
  children: React.ReactNode
  action: () => void
}> = ({ title, message, children, actionText, action }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg border-none bg-gradient-to-r from-[#2E046A] to-[#162951] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)]">
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <p className="text-sm text-white opacity-80">{message}</p>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            size={'md'}
            variant={'outline'}>
            Batal
          </Button>
          <Button
            size={'md'}
            variant={'destructive'}
            onClick={() => {
              action()
              setIsOpen(false)
            }}>
            {actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
