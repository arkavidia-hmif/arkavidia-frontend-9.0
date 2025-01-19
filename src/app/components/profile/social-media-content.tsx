'use client'

import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { self } from '~/api/generated'
import SocialMediaInput from './social-media-input'

export interface SocialMediaDefaultValue {
  line: string | null
  discord: string | null
  instagram: string | null
}

export const SocialMediaContent = () => {
  const [currentValue, setCurrentValue] = useState<SocialMediaDefaultValue>({
    line: null,
    discord: null,
    instagram: null
  })
  const axiosAuth = useAxiosAuth()

  useEffect(() => {
    const fetchSelf = async () => {
      const res = await self({ client: axiosAuth })

      if (res.data) {
        setCurrentValue({
          line: res.data.idLine,
          discord: res.data.idDiscord,
          instagram: res.data.idInstagram
        })
      }
    }

    fetchSelf()
  }, [])

  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-6 py-8 shadow-lg md:flex-row md:gap-36">
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center gap-x-2">
          <Image
            src="/images/profile/linelogo.svg"
            alt="Line Logo"
            width={48}
            height={48}
            className="mr-2 h-12 w-12 rounded-full"
          />
          <div className="w-72">
            <SocialMediaInput
              title={'Line'}
              default_value={currentValue.line ?? ''}
              placeholder={'Enter Line ID'}
              type="line"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-x-2">
          <Image
            src="/images/profile/discordlogo.jpg"
            alt="Discord Logo"
            width={48}
            height={48}
            className="mr-2 h-12 w-12 rounded-full"
          />
          <div className="w-72">
            <SocialMediaInput
              title={'Discord'}
              default_value={currentValue.discord ?? ''}
              placeholder={'Enter Discord ID'}
              type="discord"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center gap-x-2">
          <Image
            src="/images/profile/intagramlogo.png"
            alt="Instagram Logo"
            width={48}
            height={48}
            className="mr-2 h-12 w-12 rounded-full"
          />
          <div className="w-72">
            <SocialMediaInput
              title={'Instagram'}
              default_value={currentValue.instagram ?? ''}
              placeholder={'Enter Instagram Name'}
              type="ig"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
