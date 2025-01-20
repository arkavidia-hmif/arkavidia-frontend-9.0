import React, { useState } from 'react'
import { ProfileData } from './profile-data'
import { Input } from '../Input'
import { updateUser } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'

interface SocialMediaInputProps {
  title: string
  default_value: string
  placeholder: string
  logoSrc?: React.ReactNode
  type: 'line' | 'ig' | 'discord'
}

function SocialMediaInput({
  title,
  default_value,
  placeholder,
  logoSrc,
  type
}: SocialMediaInputProps) {
  const axiosAuth = useAxiosAuth()
  const { toast } = useToast()
  const [value, setValue] = useState<string>(default_value)
  const [tempValue, setTempValue] = useState<string>(default_value)

  const handleSave = async () => {
    let update
    if (type === 'line') {
      update = await updateUser({ client: axiosAuth, body: { idLine: tempValue } })
    } else if (type === 'ig') {
      update = await updateUser({ client: axiosAuth, body: { idInstagram: tempValue } })
    } else if (type === 'discord') {
      update = await updateUser({ client: axiosAuth, body: { idDiscord: tempValue } })
    }

    if (update && update.error) {
      toast({
        title: `Failed to update ${type}`,
        description: 'Something went wrong',
        variant: 'destructive'
      })
    }

    if (update && update.data) {
      setValue(tempValue)
      setTempValue(value)
      toast({
        title: `Success`,
        description: 'Update successful',
        variant: 'success'
      })
    }
  }

  return (
    <ProfileData
      handleSave={handleSave}
      handleCancel={() => setTempValue(value)}
      title={title}
      value={value.length > 0 ? value : 'Not set'}>
      <div className="flex items-center">
        {logoSrc && <div className="mr-2">{logoSrc}</div>}
        <Input
          placeholder={placeholder}
          className="w-full bg-lilac-100 py-6 text-purple-400"
          value={tempValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTempValue(e.target.value)
          }
        />
      </div>
    </ProfileData>
  )
}

export default SocialMediaInput
