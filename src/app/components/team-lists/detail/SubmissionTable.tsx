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

export interface SubmissionDoc {
  title: string
  file_name: string
  file_url: string
  status: string
}

function SubmissionTable({
  submissionDocs
}: {
  finalist?: boolean
  submissionDocs: SubmissionDoc[]
}) {
  const variantDeterminer = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'success'
      case 'Waiting':
        return 'warning'
      case 'Not Submitted':
        return 'danger'
      default:
        return 'neutral'
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead className="w-[300px]">Submission</TableHead>
          <TableHead>File</TableHead>
          <TableHead className="w-[300px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissionDocs.map((doc, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="text-left">{doc.title}</TableCell>
            <TableCell>
              <Link href={doc.file_url} className="underline underline-offset-auto">
                {doc.file_name}
              </Link>{' '}
            </TableCell>
            <TableCell>
              <Tag text={doc.status} variant={variantDeterminer(doc.status)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default SubmissionTable
