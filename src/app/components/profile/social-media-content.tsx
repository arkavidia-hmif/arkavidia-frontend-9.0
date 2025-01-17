import { InputProfileData } from './profile-data';
import Image from 'next/image';

export interface SocialMediaDefaultValue {
  line?: { id: number; value: string };
  discord?: { id: number; value: string };
  instagram?: { id: number; value: string };
}

interface Props extends SocialMediaDefaultValue {}

export const SocialMediaContent = (props: Props) => {
  return (
    <div className="flex justify-between md:gap-36 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 pb-72 pt-20 shadow-lg md:flex-row flex-col gap-8">
      <div className="flex w-full flex-col gap-8">
        <InputProfileData
          title={'Line'}
          default_value={props.line?.value ?? ''}
          placehodler={'Enter Line ID'}
          logoSrc={
            <Image
              src="/images/profile/linelogo.jpeg"
              alt="Line Logo"
              width={32}
              height={32}
            />
          }
        />
        <InputProfileData
          title={'Discord'}
          default_value={props.discord?.value ?? ''}
          placehodler={'Enter Discord ID'}
          logoSrc={
            <Image
              src="/images/profile/discordlogo.png"
              alt="Discord Logo"
              width={32}
              height={32}
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
              src="/images/profile/instagramlogo.jpeg"
              alt="Instagram Logo"
              width={32}
              height={32}
            />
          }
        />
      </div>
    </div>
  );
};
