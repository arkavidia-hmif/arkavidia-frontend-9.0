import { InputProfileData } from './profile-data'
import Image from 'next/image'

export interface SocialMediaDefaultValue {
  line?: { id: number; value: string }
  discord?: { id: number; value: string }
  instagram?: { id: number; value: string }
}

interface Props extends SocialMediaDefaultValue {}

export const SocialMediaContent = (props: Props) => {
  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row md:gap-36">
      <div className="flex w-full flex-col gap-8">
        <div className="flex gap-x-2">
          <Image
            src="/images/profile/linelogo.svg"
            alt="Line Logo"
            width={48}
            height={48}
          />
          <InputProfileData
            title={'Line'}
            default_value={props.line?.value ?? ''}
            placehodler={'Enter Line ID'}
          />
        </div>
        <InputProfileData
          title={'Discord'}
          default_value={props.discord?.value ?? ''}
          placehodler={'Enter Discord ID'}
          logoSrc={
            <Image
              src="/images/profile/discordlogo.png"
              alt="Discord Logo"
              width={48}
              height={48}
            />
          }
        />
      </div>
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Instagram'}
          default_value={props.instagram?.value ?? ''}
          placehodler={'Enter Instagram ID'}
          logoSrc={
            <Image
              src="/images/profile/iglogo.png"
              alt="Instagram Logo"
              width={48}
              height={48}
            />
          }
        />
      </div>
    </div>
  )
}
