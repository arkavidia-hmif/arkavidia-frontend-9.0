'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

// ProfileData Component (Base Layout)
interface ProfileDataProps {
  title: string
  value: string
  handleSave: () => void
  handleCancel: () => void
  children: React.ReactNode
}

const ProfileData = ({ title, value, handleSave, handleCancel, children }: ProfileDataProps) => {
  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row justify-between text-white">
        <div className="flex w-full flex-col gap-2">
          <h1 className="font-teachers text-2xl font-bold">{title}</h1>
          <div className="relative">
            {/* Editable Section */}
            <div
              className={`${
                isEdit ? 'flex translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
              } w-full transition-all duration-300 ease-in-out`}>
              <div className="flex flex-col items-start justify-normal gap-3 md:flex-row">
                {isEdit && (
                  <>
                    {children}
                    <div className="flex flex-row gap-3">
                      <Button
                        onClick={() => {
                          handleCancel()
                          setIsEdit(false)
                        }}
                        variant={'ghost'}
                        size={'icon'}
                        className="border-2 border-[#9274FF]">
                        <Image
                          src={'/images/profile/close.svg'}
                          alt={'Close Button'}
                          width={24}
                          height={24}
                          className="mx-4 my-3 h-6 w-6"
                        />
                      </Button>
                      <Button
                        onClick={() => {
                          handleSave()
                          setIsEdit(false)
                        }}
                        variant={'ghost'}
                        className="bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs"
                        size={'icon'}>
                        <Image
                          src={'/images/profile/check.svg'}
                          alt={'Check Button'}
                          width={24}
                          height={24}
                          className="mx-5 my-3 h-6 w-6"
                        />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Display Value Section */}
            <div
              className={`${
                isEdit ? 'pointer-events-none translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
              } transition-all duration-300 ease-in-out`}>
              <h2 className="font-dmsans text-[1rem] text-lg font-normal">{value}</h2>
            </div>
          </div>
        </div>
        {!isEdit && (
          <Button variant={'ghost'} onClick={() => setIsEdit(true)}>
            <Image
              src={'/images/profile/edit.svg'}
              alt={'Edit Button'}
              width={24}
              height={24}
            />
          </Button>
        )}
      </div>
    </div>
  )
}

// InputProfileData Component
interface InputProfileDataProps {
  title: string
  default_value: string
  placeholder: string
}

export const InputProfileData = ({ title, default_value, placeholder }: InputProfileDataProps) => {
  const [value, setValue] = useState(default_value)
  const [tempValue, setTempValue] = useState(default_value)

  function handleSave() {
    setValue(tempValue) // Add save logic here
  }

  function handleCancel() {
    setTempValue(value)
  }

  return (
    <ProfileData
      title={title}
      value={value}
      handleSave={handleSave}
      handleCancel={handleCancel}>
      <Input
        placeholder={placeholder}
        className="bg-lilac-100 text-purple-400 max-md:text-xs"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
      />
    </ProfileData>
  )
}

// TeamInformationContent Component
export interface TeamInformationDefaultValue {
  name?: string
}

export const TeamInformationContent = ({ name }: TeamInformationDefaultValue) => {
  return (
    <div className="flex justify-between md:gap-36 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row flex-col gap-8">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title="Name"
          default_value={name ?? ''}
          placeholder="Enter your name"
        />
        <InputProfileData
          title="Position"
          default_value=""
          placeholder="Enter your position"
        />
        <InputProfileData
          title="Department"
          default_value=""
          placeholder="Enter your department"
        />
        <InputProfileData
          title="Email"
          default_value=""
          placeholder="Enter your email"
        />
      </div>
    </div>
  )
}
