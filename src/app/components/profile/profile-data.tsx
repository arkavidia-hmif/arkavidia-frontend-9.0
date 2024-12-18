'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Dropdown, { MenuItem } from '../Dropdown'

interface ProfileDataProps {
  title: string
  value: string
  handleSave: () => void
  handleCancel: () => void
}

interface ProfileDataLayoutProps extends ProfileDataProps {
  children: React.ReactNode
}

// Base profileData components layout
const ProfileData = (props: ProfileDataLayoutProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)

  function handleCancel() {
    props.handleCancel()
    setIsEdit(false)
  }

  function handleSave() {
    props.handleSave()
    setIsEdit(false)
  }

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row justify-between text-white">
        <div className="flex w-full flex-col gap-2">
          <h1 className="font-teachers text-2xl font-bold">{props.title}</h1>
          {isEdit ? (
            <div className="flex flex-row items-center gap-3">
              {props.children}
              <Button
                onClick={handleCancel}
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
                onClick={handleSave}
                variant={'ghost'}
                className="bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs"
                size={'icon'}>
                <Image
                  src={'/images/profile/check.svg'}
                  alt={'Close Button'}
                  width={24}
                  height={24}
                  className="mx-5 my-3 h-6 w-6"
                />
              </Button>
            </div>
          ) : (
            <h2 className="font-dmsans text-[1rem] text-lg font-normal">{props.value}</h2>
          )}
        </div>
        {!isEdit && (
          <Button variant={'ghost'} onClick={() => setIsEdit(!isEdit)}>
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

interface InputProfileDataProps {
  title: string
  default_value: string
  placehodler: string
}

export const InputProfileData = (props: InputProfileDataProps) => {
  const [value, setValue] = useState<string>(props.default_value)
  //Save the
  const [tempValue, setTempValue] = useState<string>(props.default_value)

  function onSaveInput() {
    //TODO - Fetch a save api here
    setValue(tempValue)
  }
  function onCancelInput() {
    //Cancel the edit
    setTempValue(value)
  }

  return (
    <ProfileData
      handleCancel={onCancelInput}
      title={props.title}
      value={value}
      handleSave={onSaveInput}>
      <Input
        placeholder="Masukkan password Anda"
        className="bg-lilac-100 text-purple-400 max-md:text-xs"
        value={tempValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTempValue(e.target.value)
        }
      />
    </ProfileData>
  )
}

interface DropdownProfileDataProps extends InputProfileDataProps {
  dropdownData: MenuItem[]
}

export const DropdownProfileData = (props: DropdownProfileDataProps) => {
  const [value, setValue] = useState<string>(props.default_value)
  //Save the
  const [tempValue, setTempValue] = useState<string>(props.default_value)

  function onSaveInput() {
    //TODO - Fetch a save api here
    setValue(tempValue)
  }
  function onCancelInput() {
    //Cancel the edit
    setTempValue(value)
  }
  return (
    <ProfileData
      handleCancel={onCancelInput}
      title={props.title}
      value={value}
      handleSave={onSaveInput}>
      <Dropdown data={props.dropdownData} label={''} helper_text={''} />
    </ProfileData>
  )
}

interface DatePickerProfileDataProps {
  title: string
  default_value: Date
}

export const DatePickerProfileData = (props: DatePickerProfileDataProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(props.default_value)
  const [tempDate, setTempDate] = useState<Date>(props.default_value)

  function onSaveDate() {
    // TODO - Fetch a save API here
    setSelectedDate(tempDate)
  }

  function onCancelDate() {
    // Cancel the edit
    setTempDate(selectedDate)
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  return (
    <ProfileData
      handleCancel={onCancelDate}
      title={props.title}
      value={selectedDate.toDateString()} // Format the date as a readable string
      handleSave={onSaveDate}>
      <input
        aria-label="Date"
        type="date"
        value={formatDate(tempDate)}
        onChange={e => setTempDate(new Date(e.target.value))}
        className="rounded-md border p-2 w-full text-purple-400 bg-lilac-100 border-purple-400"
      />
    </ProfileData>
  )
}
