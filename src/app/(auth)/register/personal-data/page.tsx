import Image from 'next/image'
import { MenuItem } from '~/app/components/Dropdown'
import { PersonalDataForm } from '~/app/components/register/personal-data-input-area'
import { Toaster } from '~/app/components/ui/toaster'

const DummyPersonalEducation: MenuItem[] = [
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
  },
  {
    id: 4,
    option: 'S3'
  }
]

const PersonalDataRegisterPage = () => {
  return <PersonalDataForm educationOptions={DummyPersonalEducation} />
}

export default PersonalDataRegisterPage
