import React from 'react'
import ComponentBox from './ComponentBox'
import Tugas from './Tugas'
import {
  GetEventTeamSubmissionResponse,
  GetTeamSubmissionResponse
} from '~/api/generated'

interface SubmissionItem {
  title: string
  date: Date
}

const getStatusTask = (
  data:
    | GetTeamSubmissionResponse
    | GetEventTeamSubmissionResponse extends (infer ElementType)[]
    ? ElementType
    : never
) => {
  const isDeadline = Date.now() > new Date(data.requirement.deadline ?? '').getTime()
  // No submission yet
  if (!data.submission || data.submission?.media === null) {
    if (isDeadline) {
      return 'past due'
    } else {
      return 'ongoing'
    }
  } else if (data.submission) {
    // Have a submission then marked as complete
    return 'completed'
  } else {
    return 'unknown'
  }
}

function Submisi({
  submissions
}: {
  submissions?: GetTeamSubmissionResponse | GetEventTeamSubmissionResponse
}) {
  return (
    <ComponentBox title="Task" center={false}>
      {!submissions?.length ? (
        <div className="mb-2 mt-2 text-white/60">Belum ada Submisi</div>
      ) : (
        <div className="flex w-[100%] flex-col gap-3">
          {submissions.map((submisi, index) => {
            const date = submisi.requirement.deadline?.length
              ? new Date(submisi.requirement.deadline)
              : null
            const formattedDate = date
              ? date.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                }) + ' WIB'
              : 'Unknown Deadline'
            return (
              <Tugas
                key={index}
                title={submisi.requirement.typeName}
                date={formattedDate}
                status={getStatusTask(submisi)}
              />
            )
          })}
          <div>
            <p className="mb-2 text-[12px] text-gray-300">Keterangan: </p>
            <div className="flex w-full items-center gap-x-2">
              <div className="flex h-2.5 w-2.5 gap-x-1 bg-[#E50000]/80 text-[12px]"></div>
              <p className="text-[12px]">Past due</p>
              <div className="flex h-2.5 w-2.5 gap-x-1 bg-[#FFCC00CC]/80 text-[12px]"></div>
              <p className="text-[12px]">Ongoing</p>
              <div className="flex h-2.5 w-2.5 gap-x-1 bg-[#4D06B0CC]/80 text-[12px]"></div>
              <p className="text-[12px]">Completed</p>
            </div>
          </div>
        </div>
      )}
    </ComponentBox>
  )
}

export default Submisi
