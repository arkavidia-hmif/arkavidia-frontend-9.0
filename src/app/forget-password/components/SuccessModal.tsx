import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { Button } from '~/app/components/ui/button'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex w-[70%] sm:max-w-xl flex-col gap-4 md:gap-6 rounded-lg bg-purple-800 p-8 md:p-16 text-white shadow-lg">
        <Button
          variant="link"
          onClick={onClose}
          className="absolute right-0 top-2 md:right-2 md:top-3 text-3xl text-gray-300 hover:text-white">
          <FaTimes />
        </Button>

        <h1 className="mt-4 md:mt-0 mb-4 text-center text-lg md:text-2xl font-semibold text-green-400">
          Permintaan Berhasil!!
        </h1>

        <p className="mb-4 text-sm md:text-base text-center text-lilac-200">
          Kami telah mengirimkan email permintaan ganti password ke <br />
          <span className="text-teal-200">username@gmail.com</span> <br />
          Silakan periksa email Anda dan ikuti langkah-langkah untuk mengatur ulang
          password.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center">
          <p className="text-center text-sm text-lilac-200">Belum mendapatkan email?</p>
          <Button variant="link" className=" text-lilac-200 underline px-2">
            Kirim ulang
          </Button>
        </div>
      </div>
    </div>
  )
}
