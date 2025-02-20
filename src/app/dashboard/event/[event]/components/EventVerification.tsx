'use client'

import React from 'react'
import { useState, useEffect } from 'react'

// Type imports
import {
  MemberEventVerification,
  TeamEventVerification,
  type EventVerification
} from './event-dashboard-types'

// Component imports
import { Button } from '~/app/components/Button'
import { ChevronLeft } from 'lucide-react'
import { capitalizeFirstLetter } from '~/lib/utils'
import {
  getVerifStatus,
  getVerifStatusColor,
  getVerifTriggerColor
} from './event-dashboard-utils'
import TaskDropzone from '../../../[competition]/components/TaskDropzone'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../../components/ui/accordion'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import FilePreview from '../../../[competition]/components/FilePreview'
import {
  getDownloadPresignedLink,
  GetDownloadPresignedLinkData,
  GetEventTeamByTeamIdResponse,
  getEventTeamMemberById,
  getPresignedLink,
  updateEventTeamMemberDocument,
  User
} from '~/api/generated'

type EventVerificationAll =
  | EventVerification
  | MemberEventVerification
  | TeamEventVerification

function EventVerification({
  activeTeamData,
  user
}: {
  activeTeamData?: GetEventTeamByTeamIdResponse
  user?: User
}) {
  const [selectedVerif, setSelectedVerif] = useState<EventVerificationAll | null>(null)
  const [verifications, setVerifications] = useState<EventVerificationAll[]>([])
  const [openValues, setOpenValues] = useState<string[]>([])

  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()

  const getMediaPresignedGetLink = async (
    filename: string,
    bucket: GetDownloadPresignedLinkData['query']['bucket'] | undefined
  ) => {
    try {
      if (!filename || !bucket) {
        toast({
          title: 'Error',
          description: 'Failed to fetch media: Filename or bucket not found',
          variant: 'warning',
          duration: 6000
        })
        return
      }

      const res = await getDownloadPresignedLink({
        client: axiosAuth,
        query: {
          filename: filename,
          bucket: bucket
        }
      })

      if (res.error || !res.data) {
        toast({
          title: 'Error',
          description: `Failed to fetch media: ${filename}. Error: ${res.error}`,
          variant: 'warning',
          duration: 6000
        })
        return
      }

      return res.data
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: `Failed to fetch media: ${filename}. Error: ${err}`,
        variant: 'destructive',
        duration: 6000
      })
    }
  }

  // ADD Verifications API Integration HERE
  async function fetchVerifications() {
    try {
      if (!activeTeamData || !user) {
        toast({
          title: 'Error',
          description:
            'Failed to fetch verifications.\n Error: Team data or user data not found',
          variant: 'destructive'
        })
        return
      }

      const verificationTempStorage: EventVerificationAll[] = []

      // Team document (if needed)
      // const teamDocument = activeTeamData.document
      // if (!teamDocument) {
      //   throw new Error('Failed to get team document')
      // }

      // let teamVerification: TeamEventVerification | null = null
      // if (teamDocument.length === 0) {
      //   teamVerification = {
      //     id: 'team-document',
      //     teamId: activeTeamData.id,
      //     type: 'bukti-pembayaran',
      //     isVerified: false,
      //     status: 'unsubmitted'
      //   }
      // } else {
      //   // @ts-expect-error
      //   const isVerified = teamDocument[0].isVerified ?? false
      //   // @ts-expect-error
      //   const verificationError = teamDocument[0].verificationError ?? ''
      //   const isRejected =
      //     verificationError !== '' &&
      //     verificationError !== null &&
      //     verificationError !== undefined
      //   teamVerification = {
      //     id: 'team-0',
      //     teamId: activeTeamData.id,
      //     type: 'bukti-pembayaran',
      //     status: isVerified ? 'verified' : isRejected ? 'rejected' : 'submitted',
      //     rejectionMessage: verificationError,
      //     isVerified: isVerified,
      //     // @ts-expect-error
      //     mediaLink: teamDocument[0].media.url,
      //     // @ts-expect-error
      //     mediaName: teamDocument[0].media.name
      //   }
      // }
      // verificationTempStorage.push(teamVerification)

      // User member document
      const res = await getEventTeamMemberById({
        client: axiosAuth,
        path: {
          teamId: activeTeamData.id,
          userId: user.id
        }
      })

      if (!res.data) {
        throw new Error('Failed to get team member data')
      }

      const userDocument = res.data.document
      const documentRequirement = ['poster', 'twibbon'] as Array<'poster' | 'twibbon'>

      // Check if user has submitted the required documents
      const documents = await Promise.allSettled(
        documentRequirement.map(async doc => {
          const foundDocument = userDocument?.find(userDoc => userDoc.type === doc)
          let tempDocument: EventVerificationAll

          if (!foundDocument) {
            tempDocument = {
              id: `${doc}-verification`,
              userId: user.id,
              type: doc,
              isVerified: false,
              status: 'unsubmitted'
            }
          } else {
            const isDocumentVerified = foundDocument.isVerified
            const verificationError = foundDocument.verificationError
            const isRejected =
              verificationError !== '' &&
              verificationError !== null &&
              verificationError !== undefined

            const documentURL = await getMediaPresignedGetLink(
              foundDocument.media.name,
              foundDocument.media
                .bucket as GetDownloadPresignedLinkData['query']['bucket']
            )

            tempDocument = {
              id: `${doc}-verification`,
              userId: user.id,
              type: doc,
              isVerified: isDocumentVerified,
              rejectionMessage: foundDocument.verificationError ?? '',
              status: isDocumentVerified
                ? 'verified'
                : isRejected
                  ? 'rejected'
                  : 'submitted',
              mediaLink: documentURL?.mediaUrl ?? undefined,
              mediaName: foundDocument.media.name
            }
          }

          return tempDocument
        })
      )

      documents.forEach(doc => {
        if (doc.status === 'fulfilled') {
          verificationTempStorage.push(doc.value)
        }
      })
      setVerifications(verificationTempStorage)
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to fetch verifications.\n Error: ' + err,
        variant: 'destructive'
      })
    }
  }

  async function handleMediaSubmit(mediaId: string, type: string) {
    // ADD Submit Verification Media Here
    // Step 1: Get the Team ID && User ID
    const teamID = activeTeamData?.id
    const userID = user?.id
    if (!teamID) {
      toast({
        title: 'Error',
        description: 'Failed to submit verification.\n Error: Team ID not found',
        variant: 'destructive'
      })
      return
    }

    if (!userID) {
      toast({
        title: 'Error',
        description: 'Failed to submit verification.\n Error: User ID not found',
        variant: 'destructive'
      })
      return
    }

    // Step 2: Upload document to server
    try {
      const updateRes = await updateEventTeamMemberDocument({
        client: axiosAuth,
        path: {
          teamId: teamID,
          userId: userID
        },
        body: type === 'poster' ? { posterMediaId: mediaId } : { twibbonMediaId: mediaId }
      })

      if (updateRes.error) {
        throw new Error('Failed uploading media to server')
      }
      // Step 3: If successful, update the verification status to 'submitted'
      const updatedVerifications = verifications.map(verif => {
        if (verif.type === type) {
          return {
            ...verif,
            isVerified: false,
            status: 'submitted'
          }
        }
        return verif
      })
      // Step 4: Update the verification status in the state and close the submission box
      setVerifications(updatedVerifications as MemberEventVerification[])
      setSelectedVerif(null)
      toast({
        title: 'Berhasil',
        description: 'Dokumen berhasil disimpan',
        variant: 'success'
      })
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: 'Failed to submit verification.\n Error: ' + err,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchVerifications()
    }

    fetch()
  }, [])

  useEffect(() => {
    if (verifications.length > 0) {
      setOpenValues(
        verifications
          .filter(verif => verif.status === 'unsubmitted')
          .map(filtered => filtered.id)
      ) // Convert IDs to strings
    }
  }, [verifications])

  return (
    <div className="font-dmsans">
      {selectedVerif ? (
        // Specific Verif
        <div className="rounded-lg border border-white bg-gradient-to-r from-[#0202024D]/30 to-[#7138C099]/60 px-8 py-8 md:px-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Button
                onClick={() => setSelectedVerif(null)}
                size="icon"
                className="size-9 bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white">
                <ChevronLeft />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold md:text-2xl">
                  {capitalizeFirstLetter(selectedVerif.type)
                    .split('-')
                    .map(word => capitalizeFirstLetter(word))
                    .join(' ')}
                </h1>
              </div>
            </div>
            <div>
              <p
                className={`flex h-10 items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 px-2 py-2 text-xs md:px-8 md:text-base ${getVerifStatusColor(selectedVerif.status)}`}>
                {getVerifStatus(selectedVerif.status)}
              </p>
            </div>
          </div>
          {/* <p className="mt-10">{selectedVerif.description}</p> */}
          {/* Task Dropzone */}
          <TaskDropzone bucket={selectedVerif.type} onSubmitMedia={handleMediaSubmit} />
        </div>
      ) : (
        // Verifications List
        <>
          <div className="mb-4">
            <div className="flex w-full items-center gap-x-2">
              {/* <p className="text-[12px] text-gray-300">Keterangan: </p> */}
              <div className="flex h-3 w-3 gap-x-1 bg-[#FACCCCCC]/80 text-[12px]"></div>
              <p className="text-[12px]">Unsubmitted</p>
              <div className="flex h-3 w-3 gap-x-1 bg-[#FFCC00CC]/80 text-[12px]"></div>
              <p className="text-[12px]">Submitted</p>
              <div className="flex h-3 w-3 gap-x-1 bg-[#4D06B0CC]/80 text-[12px]"></div>
              <p className="text-[12px]">Verified</p>
              <div className="flex h-3 w-3 gap-x-1 bg-[#E50000]/80 text-[12px]"></div>
              <p className="text-[12px]">Rejected</p>
            </div>
          </div>

          <Accordion type="multiple" value={openValues} onValueChange={setOpenValues}>
            {verifications?.map(verif => (
              <AccordionItem key={verif.id} value={`${verif.id}`}>
                <AccordionTrigger
                  accType="framed"
                  className={`&[data-state=open]>svg]:rotate-180 mt-2 rounded-xl border border-white px-5 py-5 outline-border hover:no-underline hover:decoration-0 md:py-7 [&>svg]:size-5 [&>svg]:-rotate-90 [&>svg]:text-white md:[&>svg]:size-7 [&[data-state=open]>svg]:rotate-0 ${getVerifTriggerColor(verif.status)}`}>
                  <p className="gap-3 text-lg font-semibold md:text-xl lg:text-[24px]">
                    {capitalizeFirstLetter(verif.type)
                      .split('-')
                      .map(word => capitalizeFirstLetter(word))
                      .join(' ')}
                    {/* <span className="ml-3 text-xs font-light md:text-sm">
                    {formatDate(verif.dueDate)}
                  </span> */}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="-mt-2 rounded-lg border border-white px-5 py-7">
                  {verif.type === 'bukti-pembayaran' && (
                    <div>
                      <p className="mb-4 md:text-[18px] lg:text-[21px]">
                        Silakan upload bukti pembayaran tim di sini
                      </p>
                      <p className="mb-1 font-bold md:text-[16px] lg:text-[19px]">
                        Rekening
                      </p>
                      <p className="md:text-[15px] lg:text-[17px]">
                        Seabank a.n. Stefany Josefina Santono
                      </p>
                      <p className="md:text-[15px] lg:text-[17px]">901723767417</p>
                    </div>
                  )}
                  {verif.type === 'poster' && (
                    <div>
                      <p className="mb-4 md:text-[18px] lg:text-[21px]">
                        Silakan upload poster di sini
                      </p>
                    </div>
                  )}
                  {verif.type === 'twibbon' && (
                    <div>
                      <p className="mb-4 md:text-[18px] lg:text-[21px]">
                        Silakan upload twibbon di sini
                      </p>
                    </div>
                  )}
                  {/* File URL Preview */}
                  <FilePreview
                    fileURL={verif.mediaLink ?? undefined}
                    name={verif.mediaName}
                  />
                  {/* End of File URL Preview */}
                  {verif.status === 'rejected' && (
                    <div className="pt-2">
                      <p className="font-teachers text-xl font-bold text-red-400">
                        Alasan penolakan
                      </p>
                      <p className="font-dmsans text-[1rem] text-lg font-normal">
                        {capitalizeFirstLetter(verif.rejectionMessage!)}
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex w-full items-center gap-3 md:justify-end">
                    <p
                      className={`flex h-12 w-[40%] items-center justify-center rounded-md border bg-gradient-to-r from-white/25 to-[#999999]/25 py-2 text-xs md:w-auto md:px-8 md:text-base ${getVerifStatusColor(verif.status)}`}>
                      {getVerifStatus(verif.status)}
                    </p>
                    <Button
                      onClick={
                        !verif.isVerified ? () => setSelectedVerif(verif) : undefined
                      }
                      size="lg"
                      disabled={verif.isVerified}
                      className={`w-[60%] text-center text-sm md:w-auto md:text-base ${verif.isVerified ? 'border-2 border-[#cccccc] bg-transparent text-[#cccccc] hover:text-[#4D06B0CC]' : 'bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white'}`}>
                      Submit Verification
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </div>
  )
}

export default EventVerification
