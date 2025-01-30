import React from 'react'
import SubmissionTable, { SubmissionDoc } from './SubmissionTable'

function SubmissionSection({
  stageData,
  competitionID,
  refetchData
}: {
  stageData: SubmissionDoc[]
  teamID: string
  competitionID: string
  refetchData: () => Promise<void>
}) {
  return (
    <div className="flex flex-col gap-6">
      <SubmissionTable
        submissionDocs={stageData}
        competitionId={competitionID}
        refetchData={refetchData}
      />
      {/* <MessageBox typeId={submission.requirement_type} feedback={submission.feedback} /> */}
    </div>
  )
}

export default SubmissionSection
