'use client'
import { SetStateAction, useState } from 'react'
import { ContentTabBar } from './content-tab-bar'
import { PersonalInformationContent } from './personal-information-content'
import { contentType } from './menu'

interface ProfileLayoutProps {
  personalInformation: React.ReactNode
  socialMedia: React.ReactNode
}

//NOTE: Layout for the profile content, this is for mantaining the state of the content bar wheter to render the personal information or to render the social media
export const ProfileLayout = ({
  personalInformation,
  socialMedia
}: ProfileLayoutProps) => {
  const [selected, setSelected] = useState<contentType>('Profile Information')
  const renderProfileInfo = selected === 'Profile Information'
  return (
    <>
      <ContentTabBar selected={selected} setSelected={setSelected} />
      <div className='mt-2'>

      {renderProfileInfo ? personalInformation : socialMedia}
      </div>
    </>
  )
}
