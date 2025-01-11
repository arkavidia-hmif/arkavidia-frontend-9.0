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

interface PersonalDataProps {
  educationOptions: MenuItem[]
}

// Form Schema
const registerPersonalDataSchema = z.object({
  fullname: z.string().email({
    message: 'Invalid email'
  }),
  birthdate: z.date().nullable().optional(),
  education: z.string().nullable().optional(),
  institution: z.string(),
  phonenumber: z
    .string()
    .refine(val => !isNaN(Number(val)), {
      message: 'Phone number must be a valid number'
    })
    .refine(val => val.length === 8, {
      message: 'Phone number must be exactly 8 digits'
    }),
  lineid: z.string().optional(),
  instagram: z.string().optional(),
  discord: z.string().optional(),
  formacceptance: z.boolean({
    message: 'Please fill the form Consent'
  })
})

export const PersonalDataForm = (props: PersonalDataProps) => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof registerPersonalDataSchema>>({
    resolver: zodResolver(registerPersonalDataSchema),
    defaultValues: {
      fullname: '',
      birthdate: null,
      education: null,
      institution: '',
      phonenumber: '',
      lineid: '',
      instagram: '',
      discord: '',
      formacceptance: false
    }
  })

  const isFormAccepted = form.watch('formacceptance')

  /**
   * Used when form submitted
   * @param values Schema data
   */
  function onSubmit(values: z.infer<typeof registerPersonalDataSchema>) {
    // TODO: Replace with backend logic
    if (isFormAccepted) {
      console.log('Register Value: ' + values)
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
          variant: 'destructive'
        })
      }
    })
  }

  return (
    //TODO : Replace padding and gap into design system pad and gap
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, handleFormErrors)}
        className="flex flex-col gap-12 rounded-xl bg-purple-800 max-lg:px-[60px] max-lg:py-[60px] max-md:px-[36px] max-md:py-[40px] lg:px-[72px] lg:py-[80px]">
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
                  <Input
                    type="date"
                    className="border-[1.5px] border-purple-300 bg-lilac-100 text-purple-500 max-md:text-xs"
                    placeholder="Masukkan tanggal lahir Anda"
                    value={
                      field.value ? new Date(field.value).toISOString().split('T')[0] : ''
                    }
                    onChange={e =>
                      field.onChange(e.target.value ? new Date(e.target.value) : null)
                    }
                  />
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
                    onChange={item => field.onChange(item?.option ?? null)}
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
            name="phonenumber"
            render={({ field }) => (
              <FormItem className={`flex flex-col gap-2`}>
                <FormLabel className="text-lilac-200 max-md:text-xs">
                  Nomor Handphone <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-[1.5px] border-purple-300 bg-lilac-100 pr-10 text-purple-500 placeholder:text-purple-500 max-md:text-xs"
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
                <FormLabel className="text-lilac-200 max-md:text-xs">Instagram</FormLabel>
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
                          Dengan ini, saya menyatakan dengan sesungguhnya bahwa semua data
                          yang diberikan bersifat benar
                        </span>
                      }
                      textclassName="text-sm"></Checkbox>
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
          Register
        </Button>
      </form>
    </Form>
  )
}
