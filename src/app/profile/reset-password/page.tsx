'use client'

import Image from 'next/image'
import { Button } from '~/app/components/Button'
import { Input } from '~/app/components/ui/input'

const USERNAME = 'Ahmad John Doe'
const EMAIL = 'ahmadjohndoe@gmail.com'

const GRADIENT_BG =
  'linear-gradient(to right, rgba(255,255,255,0.24), rgba(255,255,255,0.08))'
const SHADOW = '0 0 10px rgba(255, 255, 255, 0.5)'

export default function ResetPasswordPage() {
  return (
    <div className="relative h-[100vh] min-h-screen w-full overflow-auto bg-gradient-to-b from-[#1f0246] to-[#2e046a]">
      <Image
        src="/images/profile/reset-password/bg.png"
        alt="Background"
        className="absolute h-full w-full object-cover object-left"
        width={1920}
        height={1080}
      />

      <section className="relative flex h-[100%] w-full flex-col gap-[27px] p-[25px]">
        <h1 className="font-belanosima text-[32px] font-normal leading-10 text-white [text-shadow:0px_0px_17.7px_rgba(255,255,255,0.5)] md:text-5xl md:leading-[56px]">
          Reset Password
        </h1>

        {/* <section className="rounded-[9px] bg-[linear-gradient(to_right,rgba(255,255,255,0.24),rgba(255,255,255,0.08))] p-px"> */}
        <section>
          <div
            className="rounded-lg border border-[rgba(255,255,255,0.48)] py-8 pl-6 shadow-[0_0_10px_rgba(255,255,255,0.5)] backdrop-blur-sm"
            style={{ background: GRADIENT_BG }}>
            <h2 className="font-belanosima text-[32px] font-normal leading-10 text-white md:text-5xl md:leading-[56px]">
              {USERNAME}
            </h2>
            <span className="text- font-dmsans text-base font-normal leading-4 text-white md:text-base md:leading-6">
              {EMAIL}
            </span>
          </div>
        </section>

        {/* <section className="h-full rounded-[9px] bg-[linear-gradient(to_right,rgba(255,255,255,0.24),rgba(255,255,255,0.08))] p-px"> */}
        <section className="flex-grow">
          <div
            className="flex h-[100%] flex-col gap-4 rounded-lg border border-[rgba(255,255,255,0.48)] px-10 pt-[72px] shadow-[0_0_10px_rgba(255,255,255,0.5)] backdrop-blur-sm md:pl-6"
            style={{ background: GRADIENT_BG }}>
            <form className="flex max-w-[607px] flex-col gap-4">
              <label htmlFor="placeholder_input_1" className="text-lilac-200">
                Old Password <span className="text-red-500">*</span>{' '}
              </label>
              <Input id="placeholder_input_1" />
              <a href="#" className="font-dmsans text-[14px] text-lilac-200 underline">
                Forget Password?
              </a>
              <label htmlFor="placeholder_input_2" className="text-lilac-200">
                New Password
              </label>
              <Input id="placeholder_input_2" />
              <label htmlFor="placeholder_input_3" className="text-lilac-200">
                Confirm New Password
              </label>
              <Input id="placeholder_input_3" />
              <div className="mt-4 flex gap-6">
                <Button variant="outline" size="xl" className="w-full">
                  Cancel
                </Button>
                <Button size="xl" className="w-full">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </section>
      </section>
    </div>
  )
}
