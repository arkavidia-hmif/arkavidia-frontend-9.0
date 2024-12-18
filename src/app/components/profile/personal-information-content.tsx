import { MenuItem } from '../Dropdown'
import {
  DatePickerProfileData,
  DropdownProfileData,
  InputProfileData
} from './profile-data'

export interface ProfileInformationDefaultValue {
  name?: string
  birthdate?: Date
  education?: string
  instance?: string
  phoneNumber?: string
  howDoYouKnowArkavidia?: string
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
  return (
    <div className="flex justify-between gap-36 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />
        
        <DatePickerProfileData title={'Birthdate'} default_value={Props.birthdate ?? new Date()} />
        <DropdownProfileData
          title={'Education'}
          default_value={Props.education ?? ''}
          placehodler={'Placeholder'}
          dropdownData={Props.educationOptions}
        />
      </div>
      <div className="flex w-full flex-col gap-8">
        <DropdownProfileData
          title={'Instance'}
          default_value={Props.instance ?? ''}
          placehodler={'Placeholder'}
          dropdownData={Props.instanceOptions}
        />
        <InputProfileData
          title={'Phone Number'}
          default_value={Props.phoneNumber ?? ''}
          placehodler={'Placeholder'}
        />
        <DropdownProfileData
          title={'How do you know about Arkavidia'}
          default_value={Props.howDoYouKnowArkavidia ?? ''}
          placehodler={'Placeholder'}
          dropdownData={Props.howDoYouKnowArkavOptions}
        />
      </div>
    </div>
  )
}
