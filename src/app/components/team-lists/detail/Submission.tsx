'use client'

import { TeamStatus } from './TeamInfo'
import MessageBox from './MessageBox'
import { useEffect } from 'react'
import { getCompetitionSubmissionRequirement } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useParams } from 'next/navigation'
import SubmissionTable from './SubmissionTable'

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
  const axiosAuth = useAxiosAuth()
  const params = useParams()

  const MOCK_SUBMISSION = [
    {
      requirement_type: 'asdfghj1',
      stage: 'Pre-eliminary',
      qualifications: NOT_FINAL_QUALIFICATIONS,
      stageSuccess: ['Pass'],
      stageFailed: ['Not Pass'],
      submissionDocs: [
        {
          title: 'Dokumen (PDF)',
          file_name: 'Dokumen.pdf',
          file_url: 'https://example.com/dokumen.pdf',
          status: 'Submitted'
        },
        {
          title: 'Figma Prototype (Link)',
          file_name: 'prototype.fig',
          file_url: 'https://example.com/prototype',
          status: 'Waiting'
        },
        {
          title: 'Video (Link)',
          file_name: 'video.mp4',
          file_url: 'https://example.com/video',
          status: 'Not Submitted'
        }
      ],
      feedback: 'Pre-eliminary feedback'
    },
    {
      requirement_type: 'asdfghja',
      stage: 'Semifinal',
      qualifications: NOT_FINAL_QUALIFICATIONS,
      stageSuccess: ['Pass'],
      stageFailed: ['Not Pass'],
      submissionDocs: [
        {
          title: 'Dokumen (PDF)',
          file_name: 'Dokumen.pdf',
          file_url: 'https://example.com/dokumen.pdf',
          status: 'Waiting'
        },
        {
          title: 'Figma Prototype (Link)',
          file_name: 'prototype.fig',
          file_url: 'https://example.com/prototype',
          status: 'Waiting'
        },
        {
          title: 'Video (Link)',
          file_name: 'video.mp4',
          file_url: 'https://example.com/video',
          status: 'Waiting'
        }
      ],
      feedback: 'Semifinal feedback'
    },
    {
      requirement_type: 'asdfghjb',
      stage: 'Final',
      qualifications: FINAL_QUALIFICATIONS,
      stageWin: ['Juara 1', 'Juara 2', 'Juara 3'],
      stageSuccess: ['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3'],
      submissionDocs: [
        {
          title: 'Dokumen titit (PDF)',
          file_name: 'Dokumen.pdf',
          file_url: 'https://example.com/dokumen.pdf',
          status: 'Waiting'
        },
        {
          title: 'Figma Prototype (Link)',
          file_name: 'prototype.fig',
          file_url: 'https://example.com/prototype',
          status: 'Waiting'
        },
        {
          title: 'Video (Link)',
          file_name: 'video.mp4',
          file_url: 'https://example.com/video',
          status: 'Waiting'
        }
      ],
      feedback: 'Final feedback'
    }
  ]

  useEffect(() => {
    if (params.teamId && typeof params.teamId === 'string') {
      const res = getCompetitionSubmissionRequirement({
        client: axiosAuth,
        path: {
          teamId: params.teamId
        }
      })
    }
  }, [])

  return (
    <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 px-[2rem] pb-[4rem] pt-[1rem] font-dmsans shadow-lg">
      <div className="flex flex-col gap-[3rem]">
        {MOCK_SUBMISSION.map((submission, index) => (
          <div className="flex flex-col gap-6" key={index}>
            <TeamStatus
              stage={submission.stage}
              qualifications={submission.qualifications}
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
