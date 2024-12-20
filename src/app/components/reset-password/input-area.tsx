'use client'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useToast } from '~/hooks/use-toast'

const ResetPasswordSchema = z.object({
  newPassword: z.string().min(8, { message: 'Password harus minimal 8 karakter' }),
  confirmPassword: z.string().min(8, { message: 'Password harus minimal 8 karakter' })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword']
})

export const ResetPasswordForm = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    console.log('Password reset data:', values)
    toast({
        title: "Password Changed",
        description: "Passwordmu sudah berhasil diganti",
      })
    // TODO: Add backend logic for password reset
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col rounded-xl bg-purple-800 max-lg:gap-[48px] max-lg:px-[60px] max-lg:py-[60px] max-md:gap-[24px] max-md:px-[36px] max-md:py-[40px] lg:gap-[48px] lg:px-[72px] lg:py-[80px]">
        <div className="flex flex-col max-lg:w-[275px] max-lg:gap-4 max-md:gap-2.5 max-md:text-[0.5rem] max-md:text-xs lg:w-[350px] lg:gap-5 font-dmsans">
          <h1 className='text-center text-lilac-200 text font-bold text-3xl mb-12 font-teachers'>Reset Password</h1>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-lilac-200 max-md:text-xs">
                  New Password <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className="bg-lilac-100 pr-10 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan password baru Anda"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <MdVisibilityOff className="h-5 w-5 text-purple-500" /> : <MdVisibility className="h-5 w-5 text-purple-500" />}
                  </button>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-lilac-200 max-md:text-xs">
                  Confirm New Password <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className="bg-lilac-100 pr-10 placeholder:text-purple-500 max-md:text-xs"
                      placeholder="Masukkan kembali password Anda"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? <MdVisibilityOff className="h-5 w-5 text-purple-500" /> : <MdVisibility className="h-5 w-5 text-purple-500" />}
                  </button>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col text-center max-lg:gap-1.5 max-md:gap-1 max-md:text-xs lg:gap-2">
          <Button
            className='p-10 py-6 bg-[linear-gradient(114deg,#48E6FF_-34.84%,#9274FF_45.46%,#C159D8_125.76%)] hover:text-purple-600 text-white max-md:text-xs font-semibold rounded-xl'
            type="submit"
            variant="ghost">
            Reset Password
          </Button>
        </div>
      </form>
    </Form>
  )
}
