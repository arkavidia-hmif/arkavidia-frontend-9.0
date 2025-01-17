import {
  PersonalInformationContent,
  ProfileInformationDefaultValue,
  ProfileInformationDropdownOptions
} from '../components/profile/personal-information-content'
import { ProfileLayout } from '../components/profile/profile-content-layout'
import { SocialMediaContent } from '../components/profile/social-media-content';

const DummyPersonalInfoData: ProfileInformationDefaultValue = {
  name: 'Ahdmad Jone Done',
  birthdate: new Date('2004-09-09'),
  education: {
    id: 1,
    option: 'Institute',
  },
  instance: {
    id: 2,
    option: 'Ahdmad Jane'
  },
  phoneNumber: '+628211912891381',
  howDoYouKnowArkavidia: {
    id: 3,
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
      id: 2,
      option: 'Besok Minggu'
    },
    {
      id: 3,
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

const DummySocialMediaData = {
  line: { id: 1, value: "john_doe123" },
  discord: { id: 2, value: "john_doe_gantengabis" },
  instagram: { id: 3, value: "@johndoe123" }
};

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
        socialMedia={
          <SocialMediaContent
            line={DummySocialMediaData.line}
            discord={DummySocialMediaData.discord}
            instagram={DummySocialMediaData.instagram}
          />
        }
      />
    </div>
  );
};

export default ProfilePage;