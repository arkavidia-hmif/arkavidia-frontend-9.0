import Link from 'next/link';
import { Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow } from '../../Table';
import Tag from '../../Tag';
import { SubmissionDoc } from '../../team-lists/detail/SubmissionTable';
import EventSubmissionEditFeedback from './EventSubmissionEditFeedback';

function EventSubmissionTable(
  {
    submissionDocs, eventID, teamID, refetchData
  }:  
  {submissionDocs: SubmissionDoc[]
    eventID: string
    teamID: string
    refetchData?: () => Promise<void>}
) {
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
                  <Link
                    href={doc.file_url.includes('https') ? doc.file_url : 'https://' + doc.file_url}
                    className="underline underline-offset-2"
                    target='_blank'>
                    {doc.file_name}
                  </Link>
                )}
              </TableCell>
              <TableCell className="text-left">
                {doc.file_name && doc.file_url ? (
                  <EventSubmissionEditFeedback
                    feedback={doc.feedback}
                    eventId={eventID}
                    teamID={teamID}
                    submissionTypeId={doc.req_id}
                    refetchData={refetchData}
                  />
                ) : (
                  <p className='text-gray-400 text-center'>Belum ada submisi</p>
                )}
                
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

export default EventSubmissionTable;