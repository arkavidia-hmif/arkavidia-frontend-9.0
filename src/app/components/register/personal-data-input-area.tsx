'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useToast } from '../../../hooks/use-toast'
import Dropdown, { MenuItem } from '../Dropdown'
import { Checkbox } from '../Checkbox'
import CustomDatePicker from '../date-picker/CustomDatePicker'
import { getPresignedLink, self, updateUser, updateUserDocument } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { axiosInstance } from '~/lib/axios'
import { useRouter } from 'next/navigation'
import { getEducation, getFormattedBirthDate } from '~/lib/utils'
import { setFilledInfo } from '~/redux/slices/auth'
import { useAppDispatch, useAppSelector } from '~/redux/store'
import useCheckFillInfo from '~/lib/hooks/useCheckFillInfo'
import { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

interface PersonalDataProps {
  educationOptions: MenuItem[]
}

const supportedFormats = ['jpg', 'jpeg', 'png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB limit

// Form Schema
const registerPersonalDataSchema = z.object({
  fullname: z.string().min(1, { message: 'Nama lengkap wajib diisi' }),
  birthdate: z
    .date({ message: 'Tanggal lahir harus valid' })
    .refine(d => d < new Date(), {
      message: 'Tanggal lahir tidak valid'
    }),
  education: z
    .string()
    .refine(val => val !== '', { message: 'Jenjang pendidikan wajib diisi' }),
  institution: z.string().min(1, { message: 'Institusi wajib diisi' }),
  phonenumber: z
    .string()
    .refine(val => !isNaN(Number(val)), {
      message: 'Nomor telepon tidak valid'
    })
    .refine(val => val.length >= 8, {
      message: 'Nomor telepon minimal memiliki 8 digit'
    }),
  identityCard: z
    .instanceof(FileList)
    .refine(val => val.length > 0, { message: 'Kartu identitas wajib diunggah' }),
  nisn: z.string().optional(),
  lineid: z.string().optional(),
  instagram: z.string().optional(),
  discord: z.string().optional(),
  formacceptance: z.boolean().refine(val => val === true, {
    message: 'Anda harus menyetujui pernyataan kebenaran data'
  }),
  consent: z.boolean()
})

export const PersonalDataForm = (props: PersonalDataProps) => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const hasFinishedRegis = useCheckFillInfo()
  const [isSMAPicked, setIsSMAPicked] = useState(false)
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const router = useRouter()
  const appDispatch = useAppDispatch()

  if (!isLoggedIn) {
    toast({
      title: 'Tidak terotorisasi',
      description: 'Anda harus login untuk mengakses halaman ini',
      variant: 'destructive'
    })
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  if (hasFinishedRegis) {
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  const form = useForm<z.infer<typeof registerPersonalDataSchema>>({
    resolver: zodResolver(registerPersonalDataSchema),
    defaultValues: {
      fullname: '',
      birthdate: undefined,
      education: '',
      institution: '',
      phonenumber: '',
      nisn: '',
      identityCard: undefined,
      lineid: '',
      instagram: '',
      discord: '',
      formacceptance: false,
      consent: false
    }
  })

  const isFormAccepted = form.watch('formacceptance')

  /**
   * Used when form submitted
   * @param values Schema data
   */
  async function onSubmit(values: z.infer<typeof registerPersonalDataSchema>) {
    // TODO: Replace with backend logic
    const fileExt = values.identityCard[0].name.split('.').pop()?.toLowerCase()
    if (!fileExt || !supportedFormats.includes(fileExt)) {
      toast({
        title: 'Unsupported File Format',
        description: `Allowed formats: ${supportedFormats.join(', ')}`,
        variant: 'destructive'
      })
      return
    }

    const fileSize = values.identityCard[0].size
    if (fileSize > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `Maximum file size is 10MB`,
        variant: 'destructive'
      })
      return
    }

    if (isFormAccepted) {
      toast({
        title: 'Mohon ditunggu',
        description: 'Sedang menyimpan data Anda...',
        variant: 'info'
      })

      // Upload to S3
      // Get User ID to be embedded into file name
      const getSelf = await self({ client: axiosAuth })
      if (getSelf.error) {
        toast({
          title: 'Error',
          description: 'Gagal mengirimkan data',
          variant: 'destructive'
        })
      }

      if (getSelf.data) {
        // Generate presigned link with userID-embedded file name
        const userId = getSelf.data.id
        const fileName = values.identityCard[0].name
        const fileExt = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
        const getLink = await getPresignedLink({
          client: axiosAuth,
          query: {
            bucket: 'kartu-identitas',
            filename: `${userId}-identity-card.${fileExt}`
          }
        })

        if (getLink.error) {
          toast({
            title: 'Error',
            description: 'Gagal melakukan upload data',
            variant: 'destructive'
          })
        }

        if (getLink.data) {
          // If we get the link, do a PUT request to S3
          const upload = await axiosInstance.put({
            url: getLink.data.presignedUrl,
            body: values.identityCard[0],
            headers: {
              'Content-Type': values.identityCard[0].type
            }
          })

          if (upload.status === 200) {
            // If the upload is successful, save the data to the backend
            let body
            // KTM
            if (values.education !== 'sma') {
              body = {
                kartuMediaId: getLink.data.mediaId
              }
            } else {
              // Kartu Pelajar
              body = {
                nisnMediaId: getLink.data.mediaId
              }
            }
            const uploadIDCardURL = await updateUserDocument({
              client: axiosAuth,
              body: body
            })

            if (uploadIDCardURL.error) {
              toast({
                title: 'Error',
                description: 'Gagal melakukan upload data',
                variant: 'destructive'
              })
            }

            if (uploadIDCardURL.data) {
              // Logic to save new user profile data
              const updateProfile = await updateUser({
                client: axiosAuth,
                body: {
                  fullName: values.fullname,
                  birthDate: getFormattedBirthDate(values.birthdate),
                  education: getEducation(values.education),
                  instance: values.institution,
                  phoneNumber: values.phonenumber,
                  nisn: values.nisn,
                  idLine: values.lineid,
                  idInstagram: values.instagram,
                  idDiscord: values.discord,
                  consent: values.formacceptance,
                  realConsent: values.consent
                }
              })

              if (updateProfile.error) {
                toast({
                  title: 'Error',
                  description: 'Gagal melakukan pembaruan data',
                  variant: 'destructive'
                })
              }

              if (updateProfile.data) {
                toast({
                  title: 'Success',
                  description: 'Data berhasil disimpan',
                  variant: 'success',
                  duration: 5000
                })
                appDispatch(setFilledInfo(true))
                setTimeout(() => {
                  router.replace('/')
                }, 1000)
              }
            }
          } else {
            toast({
              title: 'Error',
              description: 'Gagal melakukan upload data',
              variant: 'destructive'
            })
          }
        }
      }
    } else {
      toast({
        title: 'Validasi Gagal',
        description: 'Anda harus menyetujui pernyataan kebenaran data',
        variant: 'destructive'
      })
    }
  }

  /**
   * Handle form errors and show toast notifications
   */
  function handleFormErrors(errors: typeof form.formState.errors) {
    Object.values(errors).forEach(error => {
      if (error?.message) {
        toast({
          title: 'Validation Error',
          description: error.message,
          variant: 'destructive',
          duration: 10000
        })
      }
    })
  }

  const fileRef = form.register('identityCard')
  function handleEducationChange(item: MenuItem | null) {
    if (item) {
      if (getEducation(item.option) === 'sma') {
        setIsSMAPicked(true)
      } else {
        setIsSMAPicked(false)
      }
      form.setValue('nisn', undefined)
    }
  }

  if (hasFinishedRegis || !isLoggedIn) {
    return null
  } else {
    return (
      //TODO : Replace padding and gap into design system pad and gap
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, handleFormErrors)}
          className="my-6 mr-4 flex flex-col gap-6 rounded-xl bg-purple-800 max-lg:px-[60px] max-lg:py-[40px] max-md:px-[36px] max-md:py-[30px] lg:px-[72px] lg:py-[60px]">
          <Link href="/" className="flex w-full justify-end">
            <p className="flex items-center gap-x-2 text-lg text-lilac-300 hover:text-lilac-200">
              Isi Nanti <FaArrowRight size={16} />
            </p>
          </Link>
          <h1 className="w-full text-center font-teachers text-3xl font-bold text-lilac-200">
            Lengkapi Data Dirimu!
          </h1>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan nama lengkap Anda"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <CustomDatePicker onChange={date => field.onChange(date)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Pendidikan <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Dropdown
                      value={
                        props.educationOptions.find(
                          option => option.option === field.value
                        ) || null
                      }
                      onChange={item => {
                        field.onChange(item?.option ?? null)
                        handleEducationChange(item ?? null)
                      }}
                      placeholder="Pilih jenjang pendidikan anda"
                      data={props.educationOptions}
                      label={''}
                      isRequired={true}
                      className="mx-0 w-full max-w-none text-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {isSMAPicked && (
              <FormField
                control={form.control}
                name="nisn"
                render={({ field }) => (
                  <FormItem className={`flex flex-col gap-2`}>
                    <FormLabel className="text-lilac-200 max-md:text-xs">
                      NISN <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                        placeholder="Masukkan NISN Anda"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}></FormField>
            )}
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Institusi <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan institusi pendidikan Anda"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="font-dmsans font-normal text-lilac-200">
                    Contoh: Institut Teknologi Bandung, SMAN 1 Bandung
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identityCard"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Kartu Identitas (Kartu Pelajar atau Kartu Tanda Mahasiswa){' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl className="flex items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer gap-x-1 border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 file:cursor-pointer file:rounded-md file:border file:bg-purple-800 file:text-xs placeholder:text-purple-500 max-md:text-xs"
                      placeholder=""
                      {...fileRef}
                      onChange={e => field.onChange(e.target?.files ?? undefined)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Nomor Handphone <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 [appearance:textfield] placeholder:text-purple-500 max-md:text-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Masukkan nomor Whatsapp aktif"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lineid"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">ID Line</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan ID Line aktif"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Instagram
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan username Instagram"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discord"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">Discord</FormLabel>
                  <FormControl>
                    <Input
                      className="border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan username Discord"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formacceptance"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <Checkbox
                        text={
                          <span className="max-md:text-xs md:text-sm">
                            Dengan ini, saya menyatakan dengan sesungguhnya bahwa semua
                            data yang diberikan bersifat benar
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        textclassName="text-sm"
                        checked={field.value}
                        onCheckedChange={checked => field.onChange(checked)}></Checkbox>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <Checkbox
                        text={
                          <div className='max-w-[800px]'>
                            <span className="max-md:text-xs md:text-sm">
                              Dengan ini, saya memberikan persetujuan kepada Arkavidia 9.0
                              untuk menggunakan data pribadi saya di atas secara bertanggung
                              jawab untuk mendukung keberlangsungan kegiatan Arkavidia 9.0
                              serta untuk kepentingan perusahaan mitra Arkavidia 9.0
                            </span>
                          </div>
                        }
                        textclassName="text-sm text-justify"
                        checked={field.value}
                        onCheckedChange={checked => field.onChange(checked)}></Checkbox>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs'
            type="submit"
            variant={'ghost'}>
            Simpan Data
          </Button>
        </form>
      </Form>
    )
  }
}
