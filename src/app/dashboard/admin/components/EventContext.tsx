import React from 'react'
import { IndividualEventStatsAttributes } from './MainDashboardEvent'
import FrameInfo from '~/app/components/admin-dashboard/FrameInfo'

interface EventContextProps {
  individualStats?: IndividualEventStatsAttributes
  isTeam?: boolean
}

function EventContext({ individualStats, isTeam }: EventContextProps) {
  const count = individualStats?.count ?? 0
  const verified = individualStats?.verificationStatus.verified ?? 0
  const unverified = count - verified
  return (
    <>
      {/* Competition Participants */}
      <div className="my-4 flex flex-col items-center justify-between gap-4 md:my-8 md:flex-row md:gap-10">
        <>
          <FrameInfo
            number={verified}
            helperText={`Registered ${isTeam ? 'Teams' : 'Participants'}`}
            imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
          />
          <FrameInfo
            number={unverified}
            helperText={`Unverified ${isTeam ? 'Teams' : 'Participants'}`}
            imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
          />
        </>
      </div>

      {/* Submissions */}
      {/* {!isLoading && selectedCompetitionId && (
        <FrameSubmissions
          compe_id={selectedCompetitionId}
          totalTeam={CompNumber.registered}
        />
      )} */}
    </>
  )
}

export default EventContext
