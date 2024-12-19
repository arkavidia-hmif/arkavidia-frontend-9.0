import Image from 'next/image'
import { ContentTabBar } from '../components/profile/content-tab-bar'
import {
  PersonalInformationContent,
  ProfileInformationDefaultValue,
  ProfileInformationDropdownOptions
} from '../components/profile/personal-information-content'
import { ProfileLayout } from '../components/profile/profile-content-layout'

const DummyPersonalInfoData: ProfileInformationDefaultValue = {
  name: 'Ahdmad Jone Done',
  birthdate: new Date('2004-09-09'),
  education: {
    id: 1,
    option: 'Institute',
  },
  instance: {
    id: 1,
    option: 'Ahdmad Jane'
  },
  phoneNumber: '+628211912891381',
  howDoYouKnowArkavidia: {
    id: 1,
    option: 'example@gmail.com'
  },
}

const DummyDropdownOptions: ProfileInformationDropdownOptions = {
  educationOptions: [
    {
      id: 1,
      option: 'Insitute'
    },
    {
      id: 2,
      option: 'ITB'
    },
    {
      id: 3,
      option: 'UI'
    },
    {
      id: 4,
      option: 'UGM'
    }
  ],
  instanceOptions: [
    {
      id: 1,
      option: 'Ahdmad Jane'
    },
    {
      id: 1,
      option: 'Besok Minggu'
    },
    {
      id: 1,
      option: 'Object Oriented Programming'
    }
  ],
  howDoYouKnowArkavOptions: [
    {
      id: 1,
      option: 'example@gmail.com'
    },
    {
      id: 2,
      option: 'ITB@gmail.com'
    },
    {
      id: 3,
      option: 'Social Media'
    }
  ]
}

const ProfilePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A] px-6">
      <ProfileLayout
        personalInformation={
          <PersonalInformationContent
            name={DummyPersonalInfoData.name}
            birthdate={DummyPersonalInfoData.birthdate}
            education={DummyPersonalInfoData.education}
            howDoYouKnowArkavidia={DummyPersonalInfoData.howDoYouKnowArkavidia}
            instance={DummyPersonalInfoData.instance}
            phoneNumber={DummyPersonalInfoData.phoneNumber}
            educationOptions={DummyDropdownOptions.educationOptions}
            instanceOptions={DummyDropdownOptions.instanceOptions}
            howDoYouKnowArkavOptions={DummyDropdownOptions.howDoYouKnowArkavOptions}
          />
        }
        socialMedia={<div></div>}
      />
      <Image
        src={'/images/profile/bg.png'}
        alt={'Profile Background'}
        width={1920}
        height={1080}
        className="absolute h-screen w-screen"
      />
    </div>
  )
}

export default ProfilePage
