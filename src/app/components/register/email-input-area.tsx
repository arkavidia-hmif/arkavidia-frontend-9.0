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
import { Input } from '../Input'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useToast } from '../../../hooks/use-toast'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { EyeOff, Eye } from 'lucide-react'
import { basicRegister, bypassRegister } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { axiosInstance } from '~/lib/axios'
import useGAuth from '~/lib/hooks/useGAuth'
import { useRouter } from 'next/navigation'
import { VerificationModal } from '~/app/(auth)/register/components/VerificationSendModal'
import { useAppSelector } from '~/redux/store'

//TODO: Change the rules for each variable defined in schema here
const registerSchema = z
  .object({
    email: z.string().email({
      message: 'Invalid email'
    }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long'
      })
      .nonempty({
        message: "Password shouldn't be empty"
      }),
    confirmpassword: z.string().nonempty({
      message: "Confirm Password shouldn't be empty"
    })
  })
  .superRefine(({ confirmpassword, password }, ctx) => {
    if (confirmpassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword']
      })
    }
  })
export const EmailRegisterForm = () => {
  const { toast } = useToast()
  const { register } = useGAuth()
  const router = useRouter()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn) {
      toast({
        title: 'You are already logged in',
        variant: 'info',
        duration: 3000
      })
      router.push('/')
    }
  }, [])

  // Verification Modal
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const handleModalClose = () => {
    setIsVerifModalOpen(false)
  }
  // Input Visibility Handling
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(prev => !prev)
  }

  // Form
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmpassword: ''
    }
  })

  /**
   * Used when Login with google Button is clicked
   */
  function onGoogleClick() {
    //TODO: Replace with google auth function
    register()
  }

  /**
   * Used when form submitted
   * @param values The login schema data
   */
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const regRequest = await basicRegister({
      client: axiosInstance,
      body: {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmpassword
      }
    })

    if (regRequest.error) {
      // @ts-ignore
      if (regRequest.error.message! === 'User already exist') {
        toast({
          title: 'Registration Error',
          description: 'Email already in use',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Registration Error',
          description: 'Something went wrong',
          variant: 'destructive'
        })
      }
      return
    }

    toast({
      title: 'Registration Success',
      description: 'Successfully registered',
      variant: 'success'
    })
    setIsVerifModalOpen(true)
    setRegisteredEmail(values.email)
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
    <>
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
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full bg-lilac-100 pr-10 text-purple-500 max-md:text-xs"
                      placeholder="Masukkan e-mail Anda"
                      size={'md'}
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
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative text-purple-500">
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Masukkan password Anda"
                        className="w-full border-[1.5px] border-purple-300 bg-lilac-100 pr-10 max-md:text-xs"
                        size={'md'}
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-2`}>
                  <FormLabel className="text-lilac-200 max-md:text-xs">
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative text-purple-500">
                      <Input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        placeholder="Masukkan password Anda"
                        className="w-full border-[1.5px] border-purple-300 bg-lilac-100 pr-10 max-md:text-xs"
                        size={'md'}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-purple-500">
                        {confirmPasswordVisible ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col text-center max-lg:gap-1.5 max-md:gap-1 max-md:text-xs lg:gap-2">
            <Button
              className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] font-semibold text-white hover:opacity-85 max-md:text-xs'
              type="submit"
              variant={'ghost'}
              size={'sm'}>
              Register
            </Button>
            <span className="w-full font-semibold text-white max-md:text-xs lg:text-sm">
              or
            </span>

            <Button
              className="gradient-border relative flex rounded-lg bg-transparent py-5 text-white hover:bg-[#9274FF]/20 max-md:text-xs"
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
                Register dengan Google
              </span>
            </Button>
          </div>

          <span className="text-center text-xs text-lilac-200 max-md:text-[10px]">
            Sudah punya akun?{' '}
            <Link className="font-bold underline" href="/login">
              Login
            </Link>
          </span>
        </form>
      </Form>
      <VerificationModal
        isOpen={isVerifModalOpen}
        onClose={handleModalClose}
        email={registeredEmail}
      />
    </>
  )
}
