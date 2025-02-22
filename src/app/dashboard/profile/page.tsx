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
import { getUser, GetUserResponse } from '~/api/generated'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import Loading from '~/app/components/Loading'
import { useAppSelector } from '~/redux/store'

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
  const username = useAppSelector(state => state.auth.username)
  const axiosAuth = useAxiosAuth()
  const { toast } = useToast()
  const [userData, setUserData] = useState<GetUserResponse>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const identityCard = userData?.document?.find((doc) => doc.type === 'kartu-identitas')?.media

  useEffect(() => {
    const getSelf = async () => {
      setIsLoading(true)
      const res = await getUser({ client: axiosAuth })
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
            name={username}
            email={userData?.email ?? ''}
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
              identityCard={identityCard}
              nisn={userData?.nisn}
            />
          }
          socialMedia={
            <SocialMediaContent
              current={{
                line: userData?.idLine,
                discord: userData?.idDiscord,
                instagram: userData?.idInstagram
              }}
            />
          }
        />
      </div>
    )
  }
}

export default ProfilePage
