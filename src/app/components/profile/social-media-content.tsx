import { InputProfileData } from './profile-data';
import Image from 'next/image';

export interface SocialMediaDefaultValue {
  line?: { id: number, value: string };
  discord?: { id: number, value: string };
  instagram?: { id: number, value: string };
}

interface Props extends SocialMediaDefaultValue {}

export const SocialMediaContent = (props: Props) => {
  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 pl-10 pr-32 pb-72 pt-20 shadow-lg md:flex-row md:gap-36">
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center gap-x-2">
          <Image
            src="/images/profile/linelogo.svg"
            alt="Line Logo"
            width={48}
            height={48}
            className="rounded-full w-12 h-12 mr-2"
          />
          <div className="w-72"> {/* Atur lebar input field */}
            <InputProfileData
              title={'Line'}
              default_value={props.line?.value ?? ''}
              placehodler={'Enter Line ID'}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-2 mt-3">
          <Image
            src="/images/profile/discordlogo.jpg"
            alt="Discord Logo"
            width={48}
            height={48}
            className="rounded-full w-12 h-12 mr-2"
          />
          <div className="w-72"> {/* Atur lebar input field */}
            <InputProfileData
              title={'Discord'}
              default_value={props.discord?.value ?? ''}
              placehodler={'Enter Discord ID'}
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
            className="rounded-full w-12 h-12 mr-2"
          />
          <div className="w-72"> {/* Atur lebar input field */}
            <InputProfileData
              title={'Instagram'}
              default_value={props.instagram?.value ?? ''}
              placehodler={'Enter Instagram Name'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};