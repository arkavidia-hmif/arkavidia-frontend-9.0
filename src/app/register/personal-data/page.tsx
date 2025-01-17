import Image from 'next/image'
import { MenuItem } from '~/app/components/Dropdown'
import { PersonalDataForm } from '~/app/components/register/personal-data-input-area'
import { Toaster } from '~/app/components/ui/toaster'

const DummyPersonalEducation: MenuItem[] = [
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
]

const PersonalDataRegisterPage = () => {
  return (
    
      <PersonalDataForm educationOptions={DummyPersonalEducation} />
    
  )
}

export default PersonalDataRegisterPage
