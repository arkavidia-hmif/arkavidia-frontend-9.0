'use client'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Dropdown() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
    setIsLoading(false)
  }, [inputValue])

  return (
    <div className="mx-auto w-full max-w-[350px] space-y-2">
      <Label
        htmlFor="input-27"
        className="mb-2 block font-dmsans text-base font-normal text-lilac-100">
        Label <span className="text-red-500">*</span>
      </Label>
      <div className="relative w-full">
        <input
          id="input-27"
          className="peer h-fit w-full appearance-none rounded-xl border-[1.5px] border-purple-400 bg-lilac-200 p-3 pe-12 ps-12 font-dmsans text-base font-normal leading-6 text-purple-500 shadow-[0_0_0_3px_rgba(113,56,192,1)] placeholder:font-dmsans placeholder:text-base placeholder:font-normal placeholder:leading-6 placeholder:text-purple-500 placeholder:opacity-100 focus:outline-none"
          placeholder="Placeholder"
          type="search"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />

        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          {isLoading ? (
            <LoaderCircle
              className="h-6 w-6 animate-spin text-purple-400"
              strokeWidth={2}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <Image
              src="/search.svg"
              alt="Search"
              width={24}
              height={24}
              className="h-[24px] w-[24px]"
            />
          )}
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center rounded-e-lg outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Press to speak"
          type="submit">
          <Image
            src="/arrow-down.svg"
            alt="Arrow Down"
            width={12}
            height={6}
            className="h-[6px] w-[12px]"
          />
        </button>
      </div>
      <span className="mb-[10px] mt-2 text-[14px] leading-5 text-lilac-100">Helper</span>
    </div>
  )
}
