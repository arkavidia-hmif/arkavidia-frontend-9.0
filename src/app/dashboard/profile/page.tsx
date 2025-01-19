'use client'

import { SocialMediaContent } from '~/app/components/profile/social-media-content'
import {
  PersonalInformationContent,
  ProfileInformationDefaultValue,
  ProfileInformationDropdownOptions
} from '../../components/profile/personal-information-content'
import { ProfileLayout } from '../../components/profile/profile-content-layout'
import ProfileHero from '../../components/ProfileHero'
import { useEffect, useState } from 'react'
import { self, SelfResponse } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { MenuItem } from '~/app/components/Dropdown'
import Loading from '~/app/components/Loading'

const DummyPersonalInfoData: ProfileInformationDefaultValue = {
  name: 'Ahdmad Jone Done',
  birthdate: new Date('2004-09-09'),
  education: {
    id: 1,
    option: 'Institute'
  },
  instance: {
    id: 2,
    option: 'Ahdmad Jane'
  },
  phoneNumber: '+628211912891381',
  howDoYouKnowArkavidia: {
    id: 3,
    option: 'example@gmail.com'
  }
}

export type educationOptionsType = 'SMA/MA/SMK' | 'S1' | 'S2'
const dropdownEducationOptions: Array<educationOptionsType> = ['SMA/MA/SMK', 'S1', 'S2']

const DummyDropdownOptions: ProfileInformationDropdownOptions = {
  educationOptions: [
    {
      id: 1,
      option: 'SMA/MA/SMK'
    },
    {
      id: 2,
      option: 'S1'
    },
    {
      id: 3,
      option: 'S2'
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

const ProfilePage = () => {
  const axiosAuth = useAxiosAuth()
  const { toast } = useToast()
  const [userData, setUserData] = useState<SelfResponse>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getSelf = async () => {
      setIsLoading(true)
      const res = await self({ client: axiosAuth })
      if (res.error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive'
        })
      }

      if (res.data) {
        setUserData(res.data)
      }
    }

    getSelf()
  }, [])

  useEffect(() => {
    if (userData) {
      setIsLoading(false)
    }
  }, [userData])

  if (isLoading) {
    return <Loading />
  } else {
    return (
      <div>
        <div className="mb-8">
          <ProfileHero
            title="Profile"
            name="Ahmad John Doe"
            email="example@example.com"
            isResetProfile={false}
          />
        </div>
        <ProfileLayout
          personalInformation={
            <PersonalInformationContent
              name={userData?.fullName ?? ''}
              birthdate={userData?.birthDate ?? ''}
              education={userData?.education ?? ''}
              instance={userData?.instance ?? ''}
              phoneNumber={userData?.phoneNumber ?? ''}
              educationOptions={dropdownEducationOptions}
            />
          }
          socialMedia={<SocialMediaContent />}
        />
      </div>
    )
  }
}

export default ProfilePage
