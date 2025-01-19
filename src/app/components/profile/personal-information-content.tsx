import { MenuItem } from '../Dropdown'
import {
  DatePickerProfileData,
  DropdownProfileData,
  InputProfileData
} from './profile-data'

export interface ProfileInformationDefaultValue {
  name?: string
  birthdate?: Date
  education?: MenuItem
  instance?: MenuItem
  phoneNumber?: string
  howDoYouKnowArkavidia?: MenuItem
}

export interface ProfileInformationDropdownOptions {
  educationOptions: MenuItem[]
  instanceOptions: MenuItem[]
  howDoYouKnowArkavOptions: MenuItem[]
}

export interface PersonalInfoProps {
  name: string
  birthdate: string
  education: string
  instance: string
  phoneNumber: string
  educationOptions: Array<'SMA/MA/SMK' | 'S1' | 'S2'>
}

interface Props
  extends ProfileInformationDefaultValue,
    ProfileInformationDropdownOptions {}

export const PersonalInformationContent = (props: PersonalInfoProps) => {
  const ErrorMenuItem: MenuItem = {
    id: -1,
    option: 'No data'
  }

  const educationOptions = props.educationOptions.map(
    (option: string, index: number) => ({
      id: index,
      option
    })
  )
  const currentEducation = educationOptions.find(
    options => options.option.toLowerCase() === props.education.toLowerCase()
  )

  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row md:gap-36">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Name'}
          default_value={props.name}
          placehodler={'Placeholder'}
        />

        <DatePickerProfileData title={'Birthdate'} default_value={props.birthdate} />
        <DropdownProfileData
          title={'Education'}
          selectedOption={currentEducation ?? ErrorMenuItem}
          dropdownData={educationOptions}
        />
      </div>
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Name'}
          default_value={props.instance}
          placehodler={'Placeholder'}
        />
        <InputProfileData
          title={'Phone Number'}
          default_value={props.phoneNumber}
          placehodler={'Placeholder'}
        />
      </div>
    </div>
  )
}
