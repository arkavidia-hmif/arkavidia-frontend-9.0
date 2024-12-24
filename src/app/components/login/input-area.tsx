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
import Link from 'next/link'
import { Button } from '../ui/button'
import { useToast } from "../../../hooks/use-toast"


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
  function onGoogleClick() {
    //TODO: Replace with google auth function
    console.log('Login From Google')
  }


  /**
   * Used when form submitted
   * @param values The login schema data
   */
  function onSubmit(values: z.infer<typeof loginSchema>) {
    // TODO: Replace with backend logic
    console.log('TEST IS THIS CALLED')
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
                    className="bg-lilac-100 pr-10 max-md:text-xs"
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
                  <Input
                    placeholder="Masukkan password Anda"
                    className="bg-lilac-100 max-md:text-xs"
                    {...field}
                  />
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
            className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs'
            type="submit"
            variant={"ghost"}>
            Login
          </Button>
          <span className="w-full font-semibold text-white max-md:text-xs lg:text-sm">
            or
          </span>
          {/* TODO: Replace with Google Variant Button Component */}
          <Button
            type="button"
            onClick={onGoogleClick}
            variant={'ghost'}
            className='p-10" bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white max-md:text-xs'>
            Login dengan Google
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
