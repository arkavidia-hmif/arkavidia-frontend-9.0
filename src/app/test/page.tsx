import {
  PersonalInformationContent,
  ProfileInformationDefaultValue,
} from '../components/profile/personal-information-content'
import { ProfileLayout } from '../components/profile/profile-content-layout'

const DummyPersonalInfoData: ProfileInformationDefaultValue = {
  name: 'Ahdmad Jone Done',
}


const ProfilePage = () => {
  return (
    <div
      className="relative md:min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A] px-6 max-h-fit"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <ProfileLayout
        personalInformation={
          <PersonalInformationContent
            name={DummyPersonalInfoData.name}
          />
        }
        socialMedia={<div></div>}
      />
    </div>
  )
}

export default ProfilePage
