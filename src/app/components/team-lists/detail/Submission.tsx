'use client'

import { TeamStatus } from './TeamInfo'
import MessageBox from './MessageBox'
import { useEffect, useState } from 'react'
import { getTeamSubmission } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useParams } from 'next/navigation'
import SubmissionTable, { SubmissionDoc } from './SubmissionTable'

const FINAL_QUALIFICATIONS = [
  { id: 1, option: 'Juara 1' },
  { id: 2, option: 'Juara 2' },
  { id: 3, option: 'Juara 3' },
  { id: 4, option: 'Juara Harapan 1' },
  { id: 5, option: 'Juara Harapan 2' },
  { id: 6, option: 'Juara Harapan 3' }
]

const NOT_FINAL_QUALIFICATIONS = [
  { id: 1, option: 'Pass' },
  { id: 2, option: 'Not Pass' },
  { id: 3, option: 'On Review' }
]

export default function Submission() {
  const [submission, setSubmission] = useState<
    Array<{
      stageWin?: string[]
      requirement_type: string
      stage: string
      qualifications: { id: number; option: string }[]
      stageSuccess: string[]
      stageFailed: string[]
      submissionDocs: SubmissionDoc[]
      feedback?: string
    }>
  >([])

  const axiosAuth = useAxiosAuth()
  const { teamId } = useParams()

  // const MOCK_SUBMISSION = [
  //   {
  //     requirement_type: 'asdfghj1',
  //     stage: 'Pre-eliminary',
  //     qualifications: NOT_FINAL_QUALIFICATIONS,
  //     stageSuccess: ['Pass'],
  //     stageFailed: ['Not Pass'],
  //     submissionDocs: [
  //       {
  //         title: 'Dokumen (PDF)',
  //         file_name: 'Dokumen.pdf',
  //         status: 'Submitted'
  //       },
  //       {
  //         title: 'Figma Prototype (Link)',
  //         file_name: 'prototype.fig',
  //         status: 'Waiting'
  //       },
  //       {
  //         title: 'Video (Link)',
  //         file_name: 'video.mp4',
  //         status: 'Not Submitted'
  //       }
  //     ],
  //     feedback: 'Pre-eliminary feedback'
  //   },
  //   {
  //     requirement_type: 'asdfghja',
  //     stage: 'Semifinal',
  //     qualifications: NOT_FINAL_QUALIFICATIONS,
  //     stageSuccess: ['Pass'],
  //     stageFailed: ['Not Pass'],
  //     submissionDocs: [
  //       {
  //         title: 'Dokumen (PDF)',
  //         file_name: 'Dokumen.pdf',
  //         status: 'Waiting'
  //       },
  //       {
  //         title: 'Figma Prototype (Link)',
  //         file_name: 'prototype.fig',
  //         status: 'Waiting'
  //       },
  //       {
  //         title: 'Video (Link)',
  //         file_name: 'video.mp4',
  //         status: 'Waiting'
  //       }
  //     ],
  //     feedback: 'Semifinal feedback'
  //   },
  //   {
  //     requirement_type: 'asdfghjb',
  //     stage: 'Final',
  //     qualifications: FINAL_QUALIFICATIONS,
  //     stageWin: ['Juara 1', 'Juara 2', 'Juara 3'],
  //     stageSuccess: ['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3'],
  //     submissionDocs: [
  //       {
  //         title: 'Dokumen titit (PDF)',
  //         file_name: 'Dokumen.pdf',
  //         status: 'Waiting'
  //       },
  //       {
  //         title: 'Figma Prototype (Link)',
  //         file_name: 'prototype.fig',
  //         status: 'Waiting'
  //       },
  //       {
  //         title: 'Video (Link)',
  //         file_name: 'video.mp4',
  //         status: 'Waiting'
  //       }
  //     ],
  //     feedback: 'Final feedback'
  //   }
  // ]

  useEffect(() => {
    const fetchData = async () => {
      if (teamId && typeof teamId === 'string') {
        const response = await getTeamSubmission({
          client: axiosAuth,
          path: { teamId: teamId }
        }).then(res => res.data)

        const submissionsData =
          response?.map(submission => {
            const stage =
              submission.requirement.stage.charAt(0).toUpperCase() +
              submission.requirement.stage.slice(1).toLowerCase()

            const qualifications = stage.includes('Final')
              ? FINAL_QUALIFICATIONS
              : NOT_FINAL_QUALIFICATIONS

            let stageSuccess: string[],
              stageFailed: string[],
              stageWin: string[] = []
            if (stage.includes('Final')) {
              stageWin = ['Juara 1', 'Juara 2', 'Juara 3']
              stageSuccess = ['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3']
              stageFailed = []
            } else {
              stageSuccess = ['Pass']
              stageFailed = ['Not Pass']
            }

            const defaultDocs = [
              {
                title: '-',
                file_name: '-',
                file_url: '',
                status: 'None'
              }
            ]

            if (submission.submission?.media) {
              const mediaIndex = defaultDocs.findIndex(doc =>
                doc.title.toLowerCase().includes(submission.requirement.typeName)
              )

              if (mediaIndex !== -1) {
                defaultDocs[mediaIndex] = {
                  ...defaultDocs[mediaIndex],
                  file_name: submission.submission.media.name,
                  file_url: submission.submission.media.url,
                  status: 'Submitted'
                }
              }
            }

            const deadline = new Date(submission.requirement.deadline ?? Date.now())
            const currentDate = new Date()
            if (currentDate > deadline) {
              defaultDocs.forEach(doc => {
                if (doc.status === 'Waiting') {
                  doc.status = 'Not Submitted'
                }
              })
            }

            return {
              requirement_type: submission.requirement.typeId,
              stage: stage,
              qualifications,
              stageWin,
              stageSuccess,
              stageFailed,
              submissionDocs: defaultDocs,
              feedback: submission.submission?.judgeResponse || undefined
            }
          }) || []

        setSubmission(submissionsData)
      }
    }
    fetchData()
  }, [teamId, axiosAuth])

  return (
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] pb-[4rem] pt-[1rem] font-dmsans shadow-lg">
      <div className="flex flex-col gap-[3rem]">
        {submission.map((submission, index) => (
          <div className="flex flex-col gap-6" key={index}>
            <TeamStatus
              stage={submission.stage}
              qualifications={submission.qualifications}
              stageWin={submission.stageWin ?? undefined}
              stageSuccess={submission.stageSuccess}
              stageFailed={submission.stageFailed}
            />
            <SubmissionTable submissionDocs={submission.submissionDocs} />
            <MessageBox
              typeId={submission.requirement_type}
              feedback={submission.feedback}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
