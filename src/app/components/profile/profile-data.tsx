'use client'

import Image from 'next/image'
import { useState } from 'react'
import { updateUser } from '~/api/generated/sdk.gen'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Dropdown, { MenuItem } from '../Dropdown'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
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
export const ProfileData = (props: ProfileDataLayoutProps) => {
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
          <div className="relative">
            {/* Editable Section */}
            <div
              className={`${
                isEdit
                  ? 'flex translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-2 opacity-0'
              } w-full transition-all duration-300 ease-in-out`}>
              <div className="flex w-fit flex-col justify-normal gap-3 md:flex-row md:items-center">
                {/* Field input places */}
                {isEdit && (
                  <>
                    {props.children}
                    <div className="flex flex-row gap-3">
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
                          alt={'Save Button'}
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
                isEdit
                  ? 'pointer-events-none translate-y-2 opacity-0'
                  : 'translate-y-0 opacity-100'
              } transition-all duration-300 ease-in-out`}>
              <h2 className="font-dmsans text-[1rem] text-lg font-normal">
                {props.value}
              </h2>
            </div>
          </div>
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
  logoSrc?: React.ReactNode
}

export const InputProfileData = (props: InputProfileDataProps) => {
  const axiosAuth = useAxiosAuth()
  const [value, setValue] = useState<string>(props.default_value)
  const [tempValue, setTempValue] = useState<string>(props.default_value)

  async function onSaveInput() {
    try {
      const noSpace = props.title.toLowerCase().replace(' ', '_')
      const fieldMap: Record<string, string> = {
        name: 'fullName',
        phone_number: 'phoneNumber'
      }

      const fieldName = fieldMap[noSpace]

      const response = await updateUser({
        client: axiosAuth,
        body: { [fieldName]: tempValue }
      })
      // console.log('API Response:', response)
      setValue(tempValue)
    } catch (error) {
      console.error('Failed to update input:', error)
    }
  }

  function onCancelInput() {
    setTempValue(value)
  }

  return (
    <ProfileData
      handleCancel={onCancelInput}
      title={props.title}
      value={value}
      handleSave={onSaveInput}>
      <div className="flex items-center">
        {props.logoSrc && <div className="mr-2">{props.logoSrc}</div>}
        <Input
          placeholder={props.placehodler}
          className="min-w-72 bg-lilac-100 py-6 text-purple-400"
          value={tempValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTempValue(e.target.value)
          }
        />
      </div>
    </ProfileData>
  )
}

interface DropdownProfileDataProps {
  title: string
  dropdownData: MenuItem[]
  selectedOption: MenuItem
  logoSrc?: React.ReactNode // Tambahkan prop untuk logo
}

export const DropdownProfileData = (props: DropdownProfileDataProps) => {
  const axiosAuth = useAxiosAuth()
  const [value, setValue] = useState<MenuItem>(props.selectedOption)
  const [tempValue, setTempValue] = useState<MenuItem>(props.selectedOption)

  async function onSaveInput() {
    try {
      console.log('title', props.title)
      const noSpace = props.title.toLowerCase().replace(/ /g, '_')
      console.log(noSpace)
      const fieldMap: Record<string, string> = {
        instance: 'instance',
        education: 'education',
        how_do_you_know_about_arkavidia: 'entrySource'
      }
      const fieldName = fieldMap[noSpace]
      console.log(tempValue.option)
      const response = await updateUser({
        client: axiosAuth,
        body: { [fieldName]: tempValue.option }
      })
      // console.log(response)
      setValue(tempValue)
    } catch (error) {
      console.error('Failed to update dropdown:', error)
    }
  }

  function onCancelInput() {
    setTempValue(value)
  }

  return (
    <ProfileData
      handleCancel={onCancelInput}
      title={props.title}
      value={value.option}
      handleSave={onSaveInput}>
      <div className="flex items-center">
        {props.logoSrc && <div className="mr-2">{props.logoSrc}</div>}
        <Dropdown
          data={props.dropdownData}
          label={''}
          helper_text={''}
          value={tempValue}
          onChange={selectedItem => setTempValue(selectedItem ?? value)}
        />
      </div>
    </ProfileData>
  )
}

interface DatePickerProfileDataProps {
  title: string
  default_value: Date
  logoSrc?: React.ReactNode
}

export const DatePickerProfileData = (props: DatePickerProfileDataProps) => {
  const axiosAuth = useAxiosAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(props.default_value)
  const [tempDate, setTempDate] = useState<Date>(props.default_value)

  async function onSaveDate() {
    try {
      await updateUser({
        client: axiosAuth,
        body: { birthDate: tempDate.toISOString().split('T')[0] }
      })
      setSelectedDate(tempDate)
    } catch (error) {
      console.error('Failed to update date:', error)
    }
  }

  function onCancelDate() {
    setTempDate(selectedDate)
  }

  const formatDate = (date: Date) => date.toISOString().split('T')[0]

  return (
    <ProfileData
      handleCancel={onCancelDate}
      title={props.title}
      value={selectedDate.toDateString()}
      handleSave={onSaveDate}>
      <div className="flex items-center">
        {props.logoSrc && <div className="mr-2">{props.logoSrc}</div>}
        <input
          aria-label="Date"
          type="date"
          value={formatDate(tempDate)}
          onChange={e => setTempDate(new Date(e.target.value))}
          className="w-full rounded-md border border-purple-400 bg-lilac-100 p-2 py-3 pr-40 text-purple-400"
        />
      </div>
    </ProfileData>
  )
}
