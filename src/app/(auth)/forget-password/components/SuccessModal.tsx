import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { forgotPassword } from '~/api/generated'
import { Button } from '~/app/components/ui/button'
import { useToast } from '~/hooks/use-toast'
import { axiosInstance } from '~/lib/axios'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null
  const { toast } = useToast()

  async function handleKirimUlang() {
    // Send email to user by backend API
    const res = await forgotPassword({
      client: axiosInstance,
      body: {
        email: email
      }
    })

    // If success, open modal
    if (res.data) {
      toast({
        title: 'Email berhasil dikirim ulang',
        variant: 'success'
      })
    } else {
      toast({
        // @ts-expect-error - message is not in the error object
        title: res.error.message,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex w-[70%] flex-col gap-4 rounded-lg bg-purple-800 p-8 text-white shadow-lg sm:max-w-xl md:gap-6 md:p-16">
        <Button
          variant="link"
          onClick={onClose}
          className="absolute right-0 top-2 text-3xl text-gray-300 hover:text-white md:right-2 md:top-3">
          <FaTimes />
        </Button>

        <h1 className="mb-4 mt-4 text-center text-lg font-semibold text-green-400 md:mt-0 md:text-2xl">
          Permintaan Berhasil!!
        </h1>

        <p className="mb-4 text-center text-sm text-lilac-200 md:text-base">
          Kami telah mengirimkan email permintaan ganti password ke <br />
          <span className="text-teal-200">{email}</span> <br />
          Silakan periksa email Anda dan ikuti langkah-langkah untuk mengatur ulang
          password.
        </p>

        <div className="flex flex-col items-center justify-center md:flex-row">
          <p className="text-center text-sm text-lilac-200">Belum mendapatkan email?</p>
          <Button
            variant="link"
            className="px-2 text-lilac-200 underline"
            onClick={handleKirimUlang}>
            Kirim ulang
          </Button>
        </div>
      </div>
    </div>
  )
}
