'use client'

import { useEffect, useState } from 'react'
import {
  getTeams,
  getTeamMembers,
  putChangeTeamName,
  getUser,
  deleteTeamMember,
  getTeamById,
  TeamMember,
  putChangeEventTeamName,
  deleteEventTeamMember
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import Image from 'next/image'
import { toast, useToast } from '../../../hooks/use-toast'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Loading from '../Loading'
import { DangerDialog } from '../DangerDialog'
import VerificationBox, { VerificationBoxMessage } from './VerificationBox'

// ProfileData Component
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
interface ProfileDataProps {
  verified: boolean
  name: string
  title: string
  userRole: string
  teamId: string
  userId: string
  currentUserId: string
  isEvent?: boolean
}

export const ProfileData = ({
  verified,
  name,
  title,
  userRole,
  teamId,
  userId,
  currentUserId,
  isEvent = false
}: ProfileDataProps) => {
  const authAxios = useAxiosAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleKickMember = async () => {
    if (loading) return

    try {
      setLoading(true)
      if (!isEvent) {
        await deleteTeamMember({
          client: authAxios,
          body: { userId },
          path: { teamId }
        })
      } else {
        await deleteEventTeamMember({
          client: authAxios,
          body: { userId },
          path: { teamId }
        })
      }

      toast({
        title: 'Kick Success',
        description: `Kicked ${name} from team`,
        variant: 'success'
      })

      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      toast({
        title: 'Kick Failed',
        description: 'Unable to kick member. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row justify-between text-white">
        <div className="flex w-full flex-col gap-0">
          <span
            className={`text-sm font-normal ${verified ? 'text-green-200' : 'text-red-200'}`}>
            {verified ? 'Verified' : 'Not Verified'}
          </span>
          <div
            className={`translate-y-0 opacity-100 transition-all duration-300 ease-in-out`}>
            <h2 className="mb-0 font-teachers text-2xl font-bold">{name}</h2>
          </div>
          <div className="relative">
            <h1 className="mt-0 font-dmsans text-[1rem] text-lg font-normal">
              {capitalizeFirstLetter(title)}
            </h1>
          </div>
        </div>

        {/* Tampilkan tombol kick hanya jika userRole === 'leader' dan userId !== currentUserId */}
        {userRole === 'leader' && currentUserId !== userId && (
          <DangerDialog
            title="Keluarkan Member"
            message={`Apakah kamu yakin ingin mengeluarkan ${name} dari tim?`}
            actionText="Keluarkan"
            action={handleKickMember}>
            <Button variant={'ghost'} disabled={loading}>
              {loading ? (
                <span>Loading</span>
              ) : (
                <Image
                  src={'/images/profile/close.svg'}
                  alt={'Kick Button'}
                  width={24}
                  height={24}
                />
              )}
            </Button>
          </DangerDialog>
        )}
      </div>
    </div>
  )
}

interface TeamDataProps {
  name: string
  title: string
  teamId: string
  userRole: string
  isEditable?: boolean
  isEvent?: boolean
}

export const TeamData = ({
  name,
  title,
  teamId,
  userRole,
  isEditable = true,
  isEvent = false
}: TeamDataProps) => {
  const [isEdit, setIsEdit] = useState(false)
  const [teamName, setTeamName] = useState(name)
  const [tempTeamName, setTempTeamName] = useState(name)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const authAxios = useAxiosAuth()

  const handleSave = async () => {
    setLoading(true)
    try {
      if (!isEvent) {
        await putChangeTeamName({
          client: authAxios,
          body: { name: tempTeamName },
          path: { teamId }
        })
      } else {
        await putChangeEventTeamName({
          client: authAxios,
          path: {
            teamId
          },
          body: {
            name: tempTeamName
          }
        })
      }

      toast({
        title: 'Sukses',
        description: 'Nama tim berhasil diubah',
        variant: 'success'
      })
      setTeamName(tempTeamName)
      setIsEdit(false)
    } catch (error) {
      console.error('Failed to update team name:', error)
      toast({
        title: 'Gagal',
        description: 'Gagal mengubah nama tim. Silakan coba lagi.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempTeamName(teamName)
    setIsEdit(false)
  }

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-row text-white">
        <div className="flex w-full flex-col gap-0">
          <div className="relative">
            {/* Display Value Section */}
            <div
              className={`translate-y-0 opacity-100 transition-all duration-300 ease-in-out`}>
              <h2 className="mb-0 font-teachers text-2xl font-bold">{teamName}</h2>
            </div>
            {/* Editable Section */}
            {userRole === 'leader' && isEdit && (
              <div
                className={`$${
                  isEdit
                    ? 'pointer-events-none translate-y-2 opacity-100'
                    : 'translate-y-0 opacity-0'
                } transition-all duration-300 ease-in-out`}>
                <div className="flex h-full w-full items-center gap-2">
                  <Input
                    placeholder="Enter team name"
                    className="w-full bg-lilac-100 text-purple-400"
                    value={tempTeamName}
                    onChange={e => setTempTeamName(e.target.value)}
                  />
                  <div className="flex flex-row gap-2">
                    <Button
                      onClick={handleCancel}
                      variant={'ghost'}
                      size={'icon'}
                      className="border-2 border-[#9274FF]"
                      disabled={loading}>
                      <Image
                        src={'/images/profile/close.svg'}
                        alt={'Cancel'}
                        width={24}
                        height={24}
                      />
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant={'ghost'}
                      size={'icon'}
                      className="bg-gradient-to-r from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white"
                      disabled={loading}>
                      {loading ? (
                        <span>Loading</span>
                      ) : (
                        <Image
                          src={'/images/profile/check.svg'}
                          alt={'Save'}
                          width={24}
                          height={24}
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isEdit && (
              <h1 className="mt-0 font-dmsans text-[1rem] text-lg font-normal">
                {title}
              </h1>
            )}
          </div>
        </div>
        {userRole === 'leader' && isEditable && !isEdit && (
          <Button variant={'ghost'} onClick={() => setIsEdit(true)}>
            <Image
              src={'/images/profile/edit.svg'}
              alt={'Edit Button'}
              width={24}
              height={24}
            />
          </Button>
        )}
      </div>
    </div>
  )
}

const checkMemberVerification = (member: TeamMember) => {
  let verified = true
  if (!member.document || member.document.length === 0) {
    verified = false
  }

  member.document?.forEach(doc => {
    if (!doc.isVerified) {
      verified = false
    }
  })

  return verified
}

const TeamInformationContent = ({ compeName }: { compeName: string }) => {
  const [teamName, setTeamName] = useState<string>('')
  const [teamId, setTeamId] = useState<string>('')
  const [isTeamVerified, setIsTeamVerified] = useState<boolean>(false)
  const [verificationErrors, setVerificationErrors] = useState<
    VerificationBoxMessage[] | null
  >(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('Member')
  const [members, setMembers] = useState<
    { name: string; verified: boolean; title: string; id: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const authAxios = useAxiosAuth()

  useEffect(() => {
    const fetchUserAndTeamData = async () => {
      try {
        const userResponse = await getUser({ client: authAxios })
        const userId = userResponse.data?.id
        setCurrentUserId(userId || 'null')

        const teamsResponse = await getTeams({ client: authAxios })
        const teams = teamsResponse.data

        if (Array.isArray(teams) && teams.length > 0) {
          const selectedTeam = teams.find(
            team => team.competition!.title.toLowerCase() === compeName.toLowerCase()
          )
          if (selectedTeam) {
            setTeamName(selectedTeam.name)
            setTeamId(selectedTeam.id)

            const teamDataResponse = await getTeamById({
              client: authAxios,
              path: {
                teamId: selectedTeam.id
              }
            })

            const teamData = teamDataResponse.data?.verificationStatus
            setIsTeamVerified(teamData === 'VERIFIED')
            const teamMembers = teamDataResponse.data?.teamMembers
            setVerificationErrors(null)

            if (
              teamDataResponse.data?.document &&
              teamDataResponse.data.document.length > 0 &&
              teamDataResponse.data.document[0].verificationError
            ) {
              const verif = {
                username: 'Team',
                type: 'Bukti Pembayaran',
                message: teamDataResponse.data?.document?.[0].verificationError
              }
              setVerificationErrors(prev => (prev ? [...prev, verif] : [verif]))
            }

            const transformedMembers = Array.isArray(teamMembers)
              ? teamMembers.map(member => {
                  if (member.userId === userId) {
                    setUserRole(member.role)
                  }

                  if (
                    member.user?.document &&
                    member.user?.document?.[0].verificationError &&
                    member.user?.document?.[0].verificationError.length
                  ) {
                    const userIdentityCardError = {
                      username: member.user?.fullName || 'No name data',
                      type: 'Kartu identitas',
                      message: member.user?.document?.[0].verificationError
                    }
                    setVerificationErrors(prev =>
                      prev ? [...prev, userIdentityCardError] : [userIdentityCardError]
                    )
                  }

                  member.document?.forEach(doc => {
                    if (doc.verificationError && doc.verificationError.length) {
                      const verif = {
                        username: member.user?.fullName || 'No name data',
                        type: doc.type,
                        message: doc.verificationError
                      }
                      setVerificationErrors(prev => (prev ? [...prev, verif] : [verif]))
                    }
                  })

                  return {
                    name: member.user?.fullName || 'No Name',
                    verified: checkMemberVerification(member) || false,
                    title: member.role || 'Member',
                    id: member.userId || 'null'
                  }
                })
              : []

            setMembers(transformedMembers)
          }
        } else {
          console.warn('No teams found for the user.')
        }
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }

    fetchUserAndTeamData()
  }, [authAxios])

  if (loading) {
    return (
      <div className="relative flex w-full gap-x-2 pb-20">
        <Loading isSmallVariant={true} />
        <p>Loading team info</p>
      </div>
    )
  }

  if (!teamName) {
    return <div>No Team Information Found</div>
  }

  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border border-[rgba(255,255,255,0.80)] bg-[linear-gradient(93deg,rgba(2,2,2,0.30)_7.52%,rgba(113,56,192,0.60)_104.77%)] px-10 py-20 shadow-lg md:flex-row md:gap-12 lg:gap-16">
      <div className="flex w-1/2 flex-col gap-8">
        <TeamData name={teamName} title="Team Name" teamId={teamId} userRole={userRole} />
        {members.map((member, index) => (
          <ProfileData
            key={index}
            verified={member.verified}
            name={member.name}
            title={member.title}
            userRole={userRole}
            teamId={teamId}
            userId={member.id}
            currentUserId={currentUserId}
          />
        ))}
      </div>
      <VerificationBox verifications={verificationErrors} />
    </div>
  )
}

export default TeamInformationContent
