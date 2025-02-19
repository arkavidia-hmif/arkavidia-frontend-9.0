import React from 'react'
import EventSubmissionTable from './EventSubmissionTable'
import { SubmissionDoc } from '../../team-lists/detail/SubmissionTable'


function EventSubmissionSection({
  stageData,
  eventID,
  teamID,
  refetchData
}: {
  stageData: SubmissionDoc[]
  teamID: string
  eventID: string
  refetchData: () => Promise<void>
}) {
  return (
    <div className="flex flex-col gap-6">
      <EventSubmissionTable
        submissionDocs={stageData}
        eventID={eventID}
        teamID={teamID}
        refetchData={refetchData}
      />
      {/* <MessageBox typeId={submission.requirement_type} feedback={submission.feedback} /> */}
    </div>
  )
}

export default EventSubmissionSection
