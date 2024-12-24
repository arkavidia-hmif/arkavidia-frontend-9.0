'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

// ProfileData Component (Base Layout)
interface ProfileDataProps {
  title: string
  value: string
  verified: boolean
  handleSave: () => void
  handleCancel: () => void
  children: React.ReactNode
}

const ProfileData = ({ title, value, verified, handleSave, handleCancel, children }: ProfileDataProps) => {
  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row justify-between text-white">
        <div className="flex w-full flex-col gap-0">
          <span className={`text-sm font-normal ${verified ? 'text-green-200' : 'text-red-200'}`}>
            {verified ? 'Verified' : 'Not Verified'}
          </span>
          {/* Display Value Section */}
          <div
              className={`translate-y-0 opacity-100 transition-all duration-300 ease-in-out`}>              
              <h2 className="font-teachers text-2xl font-bold mb-0">{value}</h2>
          </div>
          <div className="relative">
            {/* Editable Section */}
            <div
              className={`$${
                isEdit ? 'pointer-events-none translate-y-2 opacity-100' : 'translate-y-0 opacity-0'
              } transition-all duration-300 ease-in-out`}>           
              <div className="flex items-center gap-2 w-full h-full">
                {isEdit && (
                  <>
                    {children}
                    <div className="flex flex-row gap-2">
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
                          className="mx-4 h-6 w-6"
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
                          className="mx-5 h-6 w-6"
                        />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isEdit && (
              <h1 className="font-dmsans text-[1rem] text-lg font-normal mt-0">{title}</h1>
            )}
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

// InputData Component
interface InputDataProps {
  verified: boolean
  name: string
  title: string
}

export const InputData = ({ verified, name, title }: InputDataProps) => {
  const [value, setValue] = useState(name)
  const [tempValue, setTempValue] = useState(name)

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
      verified={verified}
      handleSave={handleSave}
      handleCancel={handleCancel}>
      <div className="flex items-center gap-2 w-full">
        <Input
          placeholder="Enter name"
          className="w-full bg-lilac-100 text-purple-400 max-md:text-xs"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
      </div>
    </ProfileData>
  )
}

// TeamData Component
interface TeamDataProps {
  name: string
  title: string
}

export const TeamData = ({ name, title }: TeamDataProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const [teamName, setTeamName] = useState(name)

  function handleSave() {
    // Add save logic here
    setTeamName(teamName)
    setIsEdit(false)
  }

  function handleCancel() {
    // Revert changes
    setTeamName(teamName)
    setIsEdit(false)
  }

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row justify-between text-white">
        <div className="flex w-full flex-col gap-0">
          <div className="relative">
            {/* Display Value Section */}
            <div
              className={`translate-y-0 opacity-100 transition-all duration-300 ease-in-out`}>              
              <h2 className="font-teachers text-2xl font-bold mb-0">{teamName}</h2>
            </div>
            {/* Editable Section */}
            <div
              className={`$${
                isEdit ? 'pointer-events-none translate-y-2 opacity-100' : 'translate-y-0 opacity-0'
              } transition-all duration-300 ease-in-out`}>           
              <div className="flex items-center gap-2 w-full h-full">
                {isEdit && (
                  <>
                    <Input
                      placeholder="Enter team name"
                      className="w-full bg-lilac-100 text-purple-400"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                    <div className="flex flex-row gap-2"> 
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
                          className="mx-4 h-6 w-6"
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
                          className="mx-5 h-6 w-6"
                        />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isEdit && (
              <h1 className="font-dmsans text-[1rem] text-lg font-normal mt-0">{title}</h1>
            )}
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

// TeamInformationContent Component
export interface TeamInformationDefaultValue {
  name?: string
}

export const TeamInformationContent = ({ name }: TeamInformationDefaultValue) => {
  return (
    <div className="flex justify-between md:gap-36 rounded-lg border border-[rgba(255,255,255,0.80)] bg-[linear-gradient(93deg,rgba(2,2,2,0.30)_7.52%,rgba(113,56,192,0.60)_104.77%)] backdrop-blur-[5px] px-10 pb-72 pt-20 shadow-lg md:flex-row flex-col gap-8">
      <div className="flex w-1/2 flex-col gap-8">
        <TeamData
          name="KOICA"
          title="Team Name"
        />
        <InputData
          verified={true}
          name={name ?? 'John Doe'}
          title="Member 1"
        />
        <InputData
          verified={true}
          name="Jane Doe"
          title="Member 2"
        />
        <InputData
          verified={false}
          name="Ali Doe"
          title="Member 3"
        />
      </div>
    </div>
  )
}
