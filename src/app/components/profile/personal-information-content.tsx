import { getEducation } from '~/lib/utils'
import { MenuItem } from '../Dropdown'
import FileData from './file-data'
import {
  DatePickerProfileData,
  DropdownProfileData,
  InputProfileData
} from './profile-data'
import { getDownloadPresignedLink, Media } from '~/api/generated'
import { useEffect, useState } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'

export interface ProfileInformationDefaultValue {
  name?: string
  birthdate?: Date
  education?: MenuItem
  instance?: MenuItem
  phoneNumber?: string
  howDoYouKnowArkavidia?: MenuItem
}

export interface ProfileInformationDropdownOptions {
  educationOptions: MenuItem[]
  instanceOptions: MenuItem[]
  howDoYouKnowArkavOptions: MenuItem[]
}

export interface PersonalInfoProps {
  name: string
  birthdate: string
  education: string
  instance: string
  phoneNumber: string
  educationOptions: Array<'SMA/MA/SMK' | 'S1' | 'S2'>
  identityCard?: Media | undefined
  nisn?: string | null
}

interface Props
  extends ProfileInformationDefaultValue,
    ProfileInformationDropdownOptions {}

    export const PersonalInformationContent = (props: PersonalInfoProps) => {
      const { toast } = useToast();
      const [url, setURL] = useState<string | null>(null);
      const [loading, setLoading] = useState(true);
      const axiosAuth = useAxiosAuth();
      
      const ErrorMenuItem: MenuItem = {
        id: -1,
        option: 'No data'
      };
    
      const educationOptions = props.educationOptions.map(
        (option: string, index: number) => ({
          id: index,
          option
        })
      );
      const currentEducation = educationOptions.find(
        options => getEducation(options.option) === props.education.toLowerCase()
      );
    
      useEffect(() => {
        const fetchURL = async () => {
          try {
            const resp = await getDownloadPresignedLink({
              client: axiosAuth,
              query: {
                filename: props.identityCard?.name ?? '-',
                // @ts-expect-error
                bucket: props.identityCard?.bucket ?? 'kartu-identitas',
              }
            });
    
            if (resp.error) {
              throw new Error('Failed to get file URL');
            }
            setURL(resp.data?.presignedUrl);
          } catch (error) {
            toast({
              title: 'File Error',
              description: 'Failed to get file URL',
              variant: 'warning'
            });
          } finally {
            setLoading(false);
          }
        };
    
        fetchURL();
      }, []); // Run only once
    
      if (loading) {
        return <div className="text-white">Loading...</div>;
      }
    
      return (
        <div className="mt-4 flex flex-col justify-between gap-8 rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-10 py-10 shadow-lg md:flex-row md:gap-36">
          <div className="flex w-full flex-col gap-8">
            <InputProfileData title={'Name'} default_value={props.name} placehodler={'Placeholder'} />
            {(props.nisn || (props.education === 'sma' && !props.nisn)) && (
              <InputProfileData title={'NISN'} default_value={props.nisn ?? ''} placehodler={'00123456789'} />
            )}
    
            <DatePickerProfileData title={'Birthdate'} default_value={props.birthdate} />
            <DropdownProfileData title={'Education'} selectedOption={currentEducation ?? ErrorMenuItem} dropdownData={educationOptions} />
          </div>
          <div className="flex w-full flex-col gap-8">
            <InputProfileData title={'Instance'} default_value={props.instance} placehodler={'Placeholder'} />
            <InputProfileData title={'Phone Number'} default_value={props.phoneNumber} placehodler={'Placeholder'} />
            <FileData initialFileName={props.identityCard?.name ?? '-'} initialFileUrl={url ?? '#'} />
          </div>
        </div>
      );
    };
    
