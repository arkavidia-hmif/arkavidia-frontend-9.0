import {
  InputProfileData
} from './profile-data'

export interface ProfileInformationDefaultValue {
  name?: string
}

interface Props
  extends ProfileInformationDefaultValue {}

export const  PersonalInformationContent = (Props: Props) => {
  return (
    <div className="flex justify-between md:gap-36 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row flex-col gap-8">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />
        
        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />

        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />

        <InputProfileData
          title={'Name'}
          default_value={Props.name ?? ''}
          placehodler={'Placeholder'}
        />
      </div>
    </div>
  )
}
