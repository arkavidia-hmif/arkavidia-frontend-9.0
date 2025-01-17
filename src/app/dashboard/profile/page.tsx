'use client'

import { useState, useEffect } from 'react'
import { self } from '~/api/generated/sdk.gen'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  PersonalInformationContent,
  ProfileInformationDropdownOptions
} from '../../components/profile/personal-information-content'
import { ProfileLayout } from '../../components/profile/profile-content-layout'
import ProfileHero from '~/app/components/ProfileHero'

const DropdownOptions: ProfileInformationDropdownOptions = {
  educationOptions: [
    { id: 1, option: 'sma' },
    { id: 2, option: 's1' },
    { id: 3, option: 's2' }
  ],
  instanceOptions: [
    { id: 1, option: 'Ahmad Jane' },
    { id: 2, option: 'Besok Minggu' },
    { id: 3, option: 'Object Oriented Programming' }
  ],
  howDoYouKnowArkavOptions: [
    { id: 1, option: 'example@gmail.com' },
    { id: 2, option: 'ITB@gmail.com' },
    { id: 3, option: 'Social Media' }
  ]
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const axiosAuth = useAxiosAuth()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userResponse = await self({
          client: axiosAuth
        })

        if (userResponse.data) {
          // console.log(userResponse.data)
          setUserData(userResponse.data)
        } else {
          throw new Error('Failed to fetch user data.')
        }
      } catch (err) {
        setError('Unable to load user information.')
        console.error(err)
      }
    }

    fetchUserInfo()
  }, [axiosAuth])

  if (error) {
    return <p>{error}</p>
  }

  if (!userData) {
    return <p>Loading...</p>
  }

  return (
    <main>
      <div className="mb-8 pt-20">
        <ProfileHero
          title="Profile"
          name={userData.fullName}
          email={userData.email}
          isResetProfile={false}
        />
      </div>
      <ProfileLayout
        personalInformation={
          <PersonalInformationContent
            name={userData.fullName}
            birthdate={userData.birthdate}
            education={{ id: 1, option: userData.education }} // Use education
            howDoYouKnowArkavidia={{ id: 1, option: userData.entrySource }} // Use entry_source
            instance={{ id: 1, option: userData.instance }} // Use instance
            phoneNumber={userData.phoneNumber} // Use phone_number
            educationOptions={DropdownOptions.educationOptions} // Static dropdown options
            instanceOptions={DropdownOptions.instanceOptions}
            howDoYouKnowArkavOptions={DropdownOptions.howDoYouKnowArkavOptions}
          />
        }
        socialMedia={<div></div>}
      />
    </main>
  )
}

export default ProfilePage
