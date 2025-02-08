import React from 'react'
import Image from 'next/image'
import { Button } from '~/app/components/Button'
import CodeBox from './code-box'

export function SuccessCreateModal({
  dashboardUrl,
  code
}: {
  dashboardUrl: string
  code: string
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 md:px-0">
        <h2 className="mb-3 break-words text-center font-teachers text-[20px] font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:text-[32px]">
          Successfully Create Team
        </h2>
        <p className="mb-16 text-center">
          Share this code with your teammate to help them join your team
        </p>
        <div className="flex w-[100%] flex-col items-center gap-[49px]">
          <CodeBox code={code} />
          <Button
            className="flex w-[100%] max-w-[432px] gap-2 rounded-xl"
            onClick={() => (window.location.href = dashboardUrl)}>
            Go to Dashboard
            <Image
              src="/icons/events/arrow_forward.svg"
              alt="Arrow Down"
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>
    </>
  )
}

export function SuccessJoinModal({
  dashboardUrl,
  teamName
}: {
  dashboardUrl: string
  teamName: string
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 md:px-0">
        <Image
          className="mb-8"
          src="/icons/events/check_circle.svg"
          alt="Arrow Down"
          width={64}
          height={64}
        />
        <h2 className="mb-3 break-words text-center font-teachers text-[20px] font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:text-[32px]">
          Successfully Join Team
        </h2>
        <p className="mb-16 text-center">
          Welcome to {teamName}. You can now accesss the dashboard
        </p>
        <div className="flex w-[100%] flex-col items-center gap-[49px]">
          <Button
            className="flex w-[100%] max-w-[432px] gap-2 rounded-xl"
            onClick={() => (window.location.href = dashboardUrl)}>
            Go to Dashboard
            <Image
              src="/icons/events/arrow_forward.svg"
              alt="Arrow Down"
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>
    </>
  )
}
