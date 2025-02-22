'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '~/app/components/ui/form'
import { Input } from '~/app/components/Input'
import { FaArrowLeft } from 'react-icons/fa'
import { Button } from '~/app/components/ui/button'
import { SuccessModal } from './SuccessModal'
import { useToast } from '~/hooks/use-toast'
import { forgotPassword } from '~/api/generated'
import { axiosInstance } from '~/lib/axios'

const loginSchema = z.object({
  email: z.string().email()
})

export const FormForgetPassword = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // Logika untuk validasi email
    const parsedValues = loginSchema.safeParse(values)
    if (!parsedValues.success) {
      toast({
        title: 'Email tidak valid',
        variant: 'destructive'
      })
      return
    }

    // Send email to user by backend API
    const res = await forgotPassword({
      client: axiosInstance,
      body: {
        email: values.email
      }
    })

    // If success, open modal
    if (res.status === 200) {
      setIsSuccessModalOpen(true)
    } else {
      toast({
        // @ts-expect-error - message is not in the error object
        title: res.error ? res.error.message : 'Gagal mengirim email',
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col rounded-xl bg-purple-800 max-lg:gap-[48px] max-lg:px-[60px] max-lg:py-[60px] max-md:gap-[24px] max-md:px-[36px] max-md:py-[40px] lg:gap-[48px] lg:px-[72px] lg:py-[80px]">
          <div className="flex items-center gap-6 lg:gap-8">
            <Button variant={'link'} type="button" onClick={() => router.back()}>
              <FaArrowLeft className="text-sm text-lilac-200 lg:text-xl" />
            </Button>
            <h1 className="text-base font-bold text-lilac-200 lg:text-2xl">
              Lupa Password
            </h1>
          </div>
          <div className="flex flex-col max-lg:w-[275px] max-lg:gap-4 max-md:gap-2.5 lg:w-[350px] lg:gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full bg-lilac-100 pr-10 max-md:text-xs"
                      placeholder="Masukkan e-mail Anda"
                      error={form.formState.errors.email?.message}
                      state={form.formState.errors.email ? 'error' : 'default'}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col text-center max-lg:gap-1.5 max-md:gap-1 lg:gap-2">
            <Button
              className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs'
              type="submit"
              variant={'ghost'}>
              Reset Password
            </Button>
          </div>
        </form>
      </Form>

      {/* Modals */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        email={form.getValues('email')}
      />
    </div>
  )
}
