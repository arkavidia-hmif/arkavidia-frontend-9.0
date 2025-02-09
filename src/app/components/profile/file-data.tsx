import { useState } from 'react'
import FileInput, { uploadedFileState } from '../FileInput'
import Image from 'next/image'
import { Button } from '../ui/button'
import { updateUserDocument } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function FileData(
{
    initialFileName,
    initialFileUrl
}
:
{
    initialFileName: string
    initialFileUrl: string
}
) {
const { toast } = useToast();
const axiosAuth = useAxiosAuth();
const [isHidden, setHidden] = useState(true);
const [fileName, setFileName] = useState<string>(initialFileName);
const [fileURL, setFileURL] = useState<string>(initialFileUrl);

const handleUpload: (e: uploadedFileState | null ) => void = async (e) => {
    if (!e) {
    return;
    }
    setHidden(true);
    const uploadIDCardURL = await updateUserDocument({
    client: axiosAuth,
    body: {
        kartuMediaId: e.mediaID ?? undefined
    }
    })
    if (uploadIDCardURL.error) {
    toast({
        title: 'Error',
        description: 'Gagal melakukan upload data',
        variant: 'destructive'
    })
    return;
    }

    console.log("Reloading..")
    window.location.reload();

}

return (
    <div>
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
                <h1 className='font-teachers font-bold text-2xl'>Student Card</h1>
                <ExternalLink strokeWidth={2.5} />
            </div>
            <Button variant={'ghost'} onClick={() => setHidden((a) => !a)}>
            <Image
                src={'/images/profile/edit.svg'}
                alt={'Edit Button'}
                width={24}
                height={24}
            />
            </Button>
        </div>
        <div className='overflow-hidden transition-all duration-300 ease-in-out'
            style={{ 
                maxHeight: isHidden ? '50px' : '0',
                opacity: isHidden ? 1 : 0,
                marginBottom: isHidden ? '12px' : '0'
            }}>
            <Link href={fileURL}>
                <p className='font-dmsans text-[1rem] text-lg font-normal hover:underline'>{fileName}</p>
            </Link>
        </div>
        <div className='overflow-hidden transition-all duration-300 ease-in-out'
            style={{ 
                maxHeight: !isHidden ? '200px' : '0',
                opacity: !isHidden ? 1 : 0
            }}>
            <FileInput 
            onUpload={handleUpload} 
            className='mt-3 w-full'
            supportedFormats={['jpeg', 'png', 'jpg']} 
            />
        </div>
    </div>
)
}