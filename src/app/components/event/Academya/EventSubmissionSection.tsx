import React from 'react'
import EventSubmissionTable from './EventSubmissionTable'
import { SubmissionDoc } from '../../team-lists/detail/SubmissionTable'

function SubmissionSection({
  stageData,
  competitionID,
}: {
  stageData: SubmissionDoc[]
  teamID: string
  competitionID: string
}) {
  async function refetchData() {

  }

  return (
    <div className="flex flex-col gap-6">
      <EventSubmissionTable
        submissionDocs={stageData}
        eventID={competitionID}
        refetchData={refetchData}
      />
      {/* <MessageBox typeId={submission.requirement_type} feedback={submission.feedback} /> */}
    </div>
  )
}

export default SubmissionSection
