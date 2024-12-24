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

interface Props
  extends ProfileInformationDefaultValue,
    ProfileInformationDropdownOptions {}

export const PersonalInformationContent = (Props: Props) => {
  const ErrorMenuItem : MenuItem = {
    id: -1,
    option: "Error"
  }
  return (
    <div className="flex justify-between md:gap-36 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row flex-col gap-8">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />
        
        <DatePickerProfileData title={'Birthdate'} default_value={Props.birthdate ?? new Date()} />
        <DropdownProfileData
          title={'Education'}
          selectedOption={Props.education ?? ErrorMenuItem}
          dropdownData={Props.educationOptions}
        />
      </div>
      <div className="flex w-full flex-col gap-8">
        <DropdownProfileData
          title={'Instance'}
          selectedOption={Props.instance ?? ErrorMenuItem}
          dropdownData={Props.instanceOptions}
        />
        <InputProfileData
          title={'Phone Number'}
          default_value={Props.phoneNumber ?? ''}
          placehodler={'Placeholder'}
        />
        <DropdownProfileData
          title={'How do you know about Arkavidia'}
          selectedOption={Props.howDoYouKnowArkavidia ?? ErrorMenuItem}
          dropdownData={Props.howDoYouKnowArkavOptions}
        />
      </div>
    </div>
  )
}
