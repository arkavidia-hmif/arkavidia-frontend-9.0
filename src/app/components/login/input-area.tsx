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
import { googleAuth } from '~/api/generated'
import { axiosInstance } from '~/lib/axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../Input'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useToast } from '../../../hooks/use-toast'
import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '~/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import useGAuth from '~/lib/hooks/useGAuth'
import { useAppDispatch } from '~/redux/store'

// Link Variable
const FORGET_PASSWORD_LINK = 'forget-password'
const REGISTER_LINK = 'register'

//TODO: Change the rules for each variable defined in schema here
const loginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email'
  }),
  password: z.string().nonempty({
    message: 'Invalid password'
  })
})

export const InputArea = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const { basicLogin } = useAuth()
  const { login } = useGAuth()

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev)
  }
  const { toast } = useToast()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  /**
   * Used when Login with google Button is clicked
   */
  async function onGoogleClick() {
    //TODO: Replace with google auth function
    login()
  }

  /**
   * Used when form submitted
   * @param values The login schema data
   */
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // TODO: Replace with backend logic
    // console.log('TEST IS THIS CALLED')
    const login = await basicLogin(values.email, values.password)

    if (login.error) {
      if (login.message === "User isn't verified") {
        toast({
          title: 'Login Gagal',
          description: 'Email belum terverifikasi',
          variant: 'destructive'
        })
      } else if (
        login.message === "User isn't verified. Verification email has ben sent!"
      ) {
        toast({
          title: 'Login Gagal',
          description: 'Email belum terverifikasi. Email verifikasi telah dikirim ulang',
          variant: 'info'
        })
      } else if (
        login.message === 'Email not found' ||
        login.message === 'Wrong password'
      ) {
        toast({
          title: 'Login Gagal',
          description: 'Email atau password salah',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Login Gagal',
          description: 'Terjadi kegagalan saat login',
          variant: 'destructive'
        })
      }

      return
    }

    toast({
      title: 'Login Success',
      description: 'Successfully logged in',
      variant: 'success'
    })
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
        className="flex flex-col rounded-xl bg-purple-800 max-lg:gap-[48px] max-lg:px-[60px] max-lg:py-[60px] max-md:gap-[24px] max-md:px-[36px] max-md:py-[40px] lg:gap-[48px] lg:px-[72px] lg:py-[80px]">
        <div className="flex flex-col max-lg:w-[275px] max-lg:gap-4 max-md:gap-2.5 max-md:text-[0.5rem] max-md:text-xs lg:w-[350px] lg:gap-5">
          {/* TODO: Replace with component input field */}
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
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-lilac-200 max-md:text-xs">
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative text-purple-500">
                    <Input
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Masukkan password Anda"
                      className="w-full border-[1.5px] border-purple-300 bg-lilac-100 pr-10 max-md:text-xs"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-purple-500">
                      {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  <Link className="text-lilac-200 underline" href={FORGET_PASSWORD_LINK}>
                    Lupa password?
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full flex-col text-center max-lg:gap-1.5 max-md:gap-1 max-md:text-xs lg:gap-2">
          {/* TODO: Replace with Login Button Component */}
          <Button
            className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] font-semibold text-white hover:opacity-85 max-md:text-xs'
            type="submit"
            variant={'ghost'}
            size={'sm'}>
            Login
          </Button>
          <span className="w-full font-semibold text-white max-md:text-xs lg:text-sm">
            or
          </span>
          {/* TODO: Replace with Google Variant Button Component */}
          <Button
            className="gradient-border relative flex rounded-lg bg-transparent py-5 text-white max-md:text-xs"
            style={{
              borderImage: 'url(/images/login/gradient-border.svg) 16 / 12px stretch'
            }}
            type="button"
            variant={'outline'}
            size={'sm'}
            onClick={onGoogleClick}>
            <Image
              src={'/images/login/google-icon.png'}
              alt="Google Icon"
              width={24}
              height={24}
            />
            <span className="bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] bg-clip-text text-transparent">
              Login dengan Google
            </span>
          </Button>
        </div>

        <span className="text-center text-xs text-lilac-200 max-md:text-[10px]">
          Belum punya akun?{' '}
          <Link className="font-bold underline" href={REGISTER_LINK}>
            Register
          </Link>
        </span>
      </form>
    </Form>
  )
}
