'use client'

import { useState, useEffect } from 'react'
import { Button } from '~/app/components/Button'
import Image from 'next/image'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  postCreateEventTeam,
  postCreateEventTeamSolo,
  getEventTeam,
  getUser,
  joinTeamByCode
} from '~/api/generated'
import { SuccessCreateModal, SuccessJoinModal } from './data-science-modal/success-modal'
import { useToast } from '~/hooks/use-toast'
import InitialModal from './data-science-modal/initial-modal'
import CreateTeamModal from './data-science-modal/create-team-modal'
import JoinTeamModal from './data-science-modal/join-team-modal'

export default function ModalPopup({
  eventType
}: {
  eventType: 'eqpginai' | 'oajbedpk' | 'oqgjwbra' | 'ogqnrwas'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinCode, setJoinCode] = useState<string>()
  const { toast } = useToast()
  const useAuth = useAxiosAuth()
  const dashboardUrl = '/dashboard/event'
  const eventMap: Map<string, string> = new Map([
    ['eqpginai', 'Software Engineer'],
    ['oajbedpk', 'Data Science'],
    ['oqgjwbra', 'UI/UX'],
    ['ogqnrwas', 'Project Manager']
  ])
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setModalState('initial')
  }

  const [teamName, setTeamName] = useState<string>()
  const [userName, setUserName] = useState<string>()
  const [teamCode, setTeamCode] = useState<string>()
  const [modalState, setModalState] = useState('initial')
  const [joinedEvent, setJoinedEvent] = useState<string[]>([])

  //   Fetching event yang udah diikutin
  useEffect(() => {
    const getEventTeamData = async () => {
      const res = await getEventTeam({ client: useAuth })

      if (res.error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive'
        })
      } else {
        //   console.log('Event Team \n' + JSON.stringify(res.data))
        const eventIds = [...new Set(res.data?.map(item => item.event_team.eventId))]
        // console.log('Event Ids \n' + JSON.stringify(eventIds))
        setJoinedEvent(eventIds)
      }
    }

    getEventTeamData()
  }, [])

  //   Fetching user data
  useEffect(() => {
    const getSelf = async () => {
      const res = await getUser({ client: useAuth })
    //   console.log('User Data \n' + JSON.stringify(res))
      if (res.error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive'
        })
      }

      if (res.data) {
        setUserName(res.data.fullName)
      }
    }

    getSelf()
  }, [])

  const registerSolo = async () => {
    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description:
          'You have already registered for ' +
          eventMap.get(eventType)?.toUpperCase() +
          ' Academy',
        variant: 'destructive'
      })
      return
    }

    const resp = await postCreateEventTeamSolo({
      client: useAuth,
      path: { eventId: eventType },
      body: { name: userName }
    })

    if (resp.error) {
      toast({
        title: resp.error.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Register Succcess',
        description: 'You are now registered to ' + eventMap.get(eventType) + ' Academy',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      window.location.href = dashboardUrl
    }
  }

  const registerTeam = async (team_name: string) => {
    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description:
          'You have already registered ' + eventMap.get(eventType) + ' Academy',
        variant: 'destructive'
      })
      return
    }

    const resp = await postCreateEventTeam({
      client: useAuth,
      path: { eventId: eventType },
      body: { name: team_name }
    })

    // console.log(JSON.stringify(resp))

    if (resp.error) {
      toast({
        title: resp.error.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Successfully Solo',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      setModalState('success create')
      setJoinCode(resp.data?.event_team.joinCode)
    }
  }

  const joinTeam = async (team_code: string) => {
    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description: 'You have already registered for this event',
        variant: 'destructive'
      })
      return
    }

    const resp = await joinTeamByCode({
      client: useAuth,
      body: { teamCode: team_code }
    })

    // console.log(JSON.stringify(resp))

    if (resp.error) {
      toast({
        title: resp.error.error,
        variant: 'destructive'
      })
    } else if (resp.data?.error) {
      toast({
        title: resp.data.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Successfully Joined',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      setModalState('success join')
    }
  }

  return (
    <div className="p-4">
      <Button
        onClick={openModal}
        className="flex gap-2 rounded-xl"
        disabled={joinedEvent.includes(eventType) || teamName === undefined}>
        Register Now
        <Image
          src="/icons/events/arrow_forward.svg"
          alt="Arrow Down"
          width={24}
          height={24}
        />
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
          {/* Modal */}
          {eventType !== 'oajbedpk' ? (
            <div className="z-10 mx-4 max-w-[700px] rounded-lg bg-gradient-to-b from-[#2E046A] to-[#0F0123] p-6 px-[65px] py-[38px] shadow-xl">
              <div className="mb-7 flex flex-col items-center gap-0">
                <span className="font-teachers text-xl font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF]">
                  Academya
                </span>
                <h2 className="break-words text-center font-teachers text-5xl font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF]">
                  {eventMap.get(eventType)?.toUpperCase()}
                </h2>
              </div>
              <p className="mb-[65px] text-center">
                If you're sure about registering for the Academya{' '}
                {eventMap.get(eventType)} Event, you'll be redirected to your dashboard
              </p>
              <Button onClick={registerSolo} className="w-[100%]">
                Register
              </Button>
            </div>
          ) : (
            <div className="relative z-10 flex h-[436px] w-[364px] flex-col items-center justify-center overflow-hidden rounded-xl border border-[#9747FF] px-3 py-[85px] shadow-xl drop-shadow-[0_0_25px_#7138C0] md:h-auto md:w-auto md:max-w-[722px] md:px-[64px]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-lg"
                style={{
                  backgroundImage: "url('/images/event/Background Modal.png')",
                  filter: 'blur(5px)',
                  zIndex: -1
                }}></div>

              {/* Content */}
              {modalState === 'initial' ? (
                <InitialModal
                  eventType={eventType}
                  eventMap={eventMap}
                  setModalState={setModalState}
                />
              ) : modalState === 'create' ? (
                <CreateTeamModal
                  eventType={eventType}
                  eventMap={eventMap}
                  setModalState={setModalState}
                  teamName={teamName}
                  setTeamName={setTeamName}
                  registerTeam={registerTeam}
                />
              ) : modalState === 'join' ? (
                <JoinTeamModal
                  eventType={eventType}
                  eventMap={eventMap}
                  setModalState={setModalState}
                  teamCode={teamCode}
                  setTeamCode={setTeamCode}
                  joinTeam={joinTeam}
                />
              ) : modalState === 'success create' ? (
                <SuccessCreateModal dashboardUrl={dashboardUrl} code={joinCode} />
              ) : modalState === 'success join' ? (
                <SuccessJoinModal
                  dashboardUrl={dashboardUrl}
                  teamName={eventMap.get(eventType)}
                />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
