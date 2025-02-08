import React from 'react'
import Image from 'next/image'
import { useToast } from '~/hooks/use-toast'

function CodeBox({ code }: { code: string }) {
  const { toast } = useToast()
  return (
    <div className="font-base flex w-[100%] max-w-[432px] grow items-center justify-between overflow-hidden rounded-xl border border-lilac-200 pr-3 text-lilac-100">
      <div className="flex items-center gap-[14px]">
        <div className="h-[100%] rounded-r-[12px] bg-lilac-200 px-[18px] py-3 text-lilac-800">
          Code
        </div>
        {code}
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="transition duration-200 ease-in-out hover:drop-shadow-[0_0_10px_#C8A2C8] focus:outline-none">
        <Image
          src="/icons/events/content_copy.svg"
          alt="Copy Code"
          width={24}
          height={24}
          onClick={() => {
            toast({
              title: 'Succesfully copied to clipboard',
              variant: 'success'
            })
          }}
        />
      </button>
    </div>
  )
}

export default CodeBox
