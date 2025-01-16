import Image from 'next/image'
import { Toaster } from '../../components/ui/toaster'
import { EmailRegisterForm } from '../../components/register/email-input-area'

const EmailRegisterPage = () => {
  return (
    <div className="z-10">
      <EmailRegisterForm />
    </div>
  )
}

export default EmailRegisterPage
