'use client'

import { Input } from './ui/input'
import { Label } from './ui/label'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import ExpandedMenu from './ui/expanded-menu'

export interface MenuItem {
  id: number
  option: string
  iconLeft?: boolean
  iconRight?: boolean
  disabled?: boolean
}

export default function Dropdown({
  data,
  label,
  helper_text
}: {
  data: MenuItem[]
  label: string
  helper_text: string
}) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(data)

  // Simulated loading state
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

  // Filter the items based on input value
  useEffect(() => {
    const filtered = data.filter(item =>
      item.option.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [inputValue, data])

  return (
    <div className="mx-auto w-full max-w-[350px] space-y-2">
      {label && (
        <Label
          htmlFor="input-27"
          className="mb-2 block font-dmsans text-base font-normal text-lilac-100">
          {label} <span className="text-red-500">*</span>
        </Label>
      )}

      {/* Input and Expanded Menu */}
      <div className="relative w-full">
        {/* Search Input */}
        <input
          id="input-27"
          className="peer h-fit w-full appearance-none rounded-xl border-[1.5px] border-purple-400 bg-lilac-200 p-3 pe-12 ps-12 font-dmsans text-base font-normal leading-6 text-purple-500 shadow-[0_0_0_3px_rgba(113,56,192,1)] placeholder:font-dmsans placeholder:text-base placeholder:font-normal placeholder:leading-6 placeholder:text-purple-500 placeholder:opacity-100 focus:outline-none"
          placeholder="Search options..."
          type="search"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />

        {/* Search Icon */}
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

        {/* Arrow Down Button */}
        <button
          onClick={() => setIsMenuOpen(prev => !prev)}
          className="absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center rounded-e-lg outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          aria-label="Toggle Menu"
          type="button">
          <Image
            src="/arrow-down.svg"
            alt="Arrow Down"
            width={12}
            height={6}
            className={`h-[6px] w-[12px] transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded Menu */}
        {isMenuOpen && (
          <div
            className={`absolute z-50 w-full rounded-md bg-lilac-100 shadow-lg ${
              helper_text ? 'mt-[38px]' : 'mt-[10px]'
            }`}>
            <ExpandedMenu items={filteredItems} />
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="relative">
        <span className="text-[14px] leading-5 text-lilac-100">{helper_text}</span>
      </div>
    </div>
  )
}
