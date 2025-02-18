import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../Table'
import Tag from '../../Tag'
import SubmissionEditFeedback from './SubmissionEditFeedback'

export interface SubmissionDoc {
  req_id: string // submission requirement's type id
  stage?: 'Final' | 'Pre-eliminary'
  title: string
  file_name: string
  file_url: string
  status: string
  feedback?: string
}

function SubmissionTable({
  submissionDocs,
  competitionId,
  refetchData
}: {
  competitionId?: string
  finalist?: boolean
  submissionDocs: SubmissionDoc[]
  refetchData?: () => Promise<void>
}) {
  const variantDeterminer = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'success'
      case 'Change Needed':
        return 'warning'
      case 'Not Submitted':
        return 'danger'
      default:
        return 'neutral'
    }
  }
  console.log(submissionDocs)
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">No</TableHead>
          <TableHead className="w-[400px]">Submission</TableHead>
          <TableHead className="w-[150px]">File</TableHead>
          <TableHead className="w-[500px]">Feedback</TableHead>
          <TableHead className="">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissionDocs.map((doc, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="text-left">{doc.title}</TableCell>
            <TableCell>
              {!doc.file_name || !doc.file_url ? (
                '-'
              ) : (
                <Link href={doc.file_url} className="underline underline-offset-2">
                  {doc.file_name}
                </Link>
              )}
            </TableCell>
            <TableCell className="text-left">
              <SubmissionEditFeedback
                feedback={doc.feedback}
                competitionId={competitionId}
                submissionTypeId={doc.req_id}
                refetchData={refetchData}
              />
            </TableCell>
            <TableCell className="text-center">
              <Tag
                text={doc.status}
                variant={variantDeterminer(doc.status)}
                className="mx-auto flex max-w-40 items-center"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SubmissionTable
