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
  joinEventTeamByCode,
  getEvent,
  User
} from '~/api/generated'
import { SuccessCreateModal, SuccessJoinModal } from './data-science-modal/success-modal'
import { useToast } from '~/hooks/use-toast'
import InitialModal from './data-science-modal/initial-modal'
import CreateTeamModal from './data-science-modal/create-team-modal'
import JoinTeamModal from './data-science-modal/join-team-modal'
import Loading from '~/app/components/Loading'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/app/components/ui/tooltip'
import { useAppSelector } from '~/redux/store'
import { useRouter } from 'next/navigation'

export default function ModalPopup({
  eventType,
  tooltip
}: {
  eventType: string
  tooltip?: string
}) {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [joinCode, setJoinCode] = useState<string>()

  const [eventMap, setEventMap] = useState<Map<string, string>>(new Map())
  const [teamName, setTeamName] = useState<string>()
  const [userName, setUserName] = useState<string>()
  const [teamCode, setTeamCode] = useState<string>()
  const [modalState, setModalState] = useState('initial')
  const [joinedEvent, setJoinedEvent] = useState<string[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [userData, setUserData] = useState<User>()

  const { toast } = useToast()
  const useAuth = useAxiosAuth()
  const router = useRouter()
  const dashboardUrl = '/dashboard'
  // const eventMap: Map<string, string> = new Map([
  //   ['eqpginai', 'Software Engineer'],
  //   ['oajbedpk', 'Data Science'],
  //   ['oqgjwbra', 'UI/UX'],
  //   ['ogqnrwas', 'Project Manager']
  // ])
  const openModal = async () => {
    if (!isLoggedIn) {
      toast({
        variant: 'warning',
        title: 'Anda belum login',
        description: 'Silakan login terlebih dahulu untuk mendaftar.'
      })
      return
    }

    if (!userData?.isRegistrationComplete) {
      toast({
        variant: 'warning',
        title: 'Anda belum menyelesaikan pendaftaran',
        description: 'Mohon selesaikan proses pendaftaran dahulu'
      })
      setTimeout(() => {
        router.push('/register/personal-data')
      }, 800)
    }

    if (isLoggedIn && userData?.isRegistrationComplete) {
      setIsModalOpen(true)
    }
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setModalState('initial')
  }

  // Function to get all event ids and titles to map
  const getEventData = async () => {
    const eventDataRes = await getEvent({ client: useAuth })
    if (eventDataRes.error || !eventDataRes.data) {
      toast({
        title: 'Error',
        description: 'Failed to fetch event data',
        variant: 'destructive'
      })
    } else {
      eventDataRes.data.map(event => {
        const eventID = event.id
        const eventTitle = event.title
        setEventMap(prevMap => new Map(prevMap.set(eventID, eventTitle)))
      })
    }
  }

  // Function untuk fetching event yang udah diikutin user
  const getEventTeamData = async () => {
    const res = await getEventTeam({ client: useAuth })

    if (res.error || !res.data) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      })
    } else {
      //   console.log('Event Team \n' + JSON.stringify(res.data))
      const eventIds = [...new Set(res.data?.map(item => item.eventId))]
      // console.log('Event Ids \n' + JSON.stringify(eventIds))
      setJoinedEvent(eventIds)
    }
  }

  const getSelf = async () => {
    const res = await getUser({ client: useAuth })
    //   console.log('User Data \n' + JSON.stringify(res))
    if (res.error || !res.data) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      })
    }

    if (res.data) {
      setUserData(res.data)
      setUserName(res.data.fullName ?? '')
    }
  }

  //   Fetching user data
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true)
      const res = await Promise.all([getEventData(), getEventTeamData(), getSelf()])
      return res
    }

    try {
      fetchData()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      })
    } finally {
      setIsFetching(false)
    }
  }, [])

  const registerSolo = async () => {
    if (!eventMap.size) {
      toast({
        title: 'Error',
        description: 'No event data',
        variant: 'destructive'
      })
      return
    }

    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description: 'You have already registered for ' + eventMap.get(eventType),
        variant: 'destructive'
      })
      return
    }

    const resp = await postCreateEventTeamSolo({
      client: useAuth,
      body: {
        eventId: eventType
      }
    })

    if (resp.error) {
      toast({
        title: 'Error on registering to event',
        // @ts-ignore
        description: resp.error.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Register Succcess',
        description: 'You are now registered to ' + eventMap.get(eventType),
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      window.location.href = dashboardUrl
    }
  }

  const registerTeam = async (team_name: string) => {
    if (!eventMap.size) {
      toast({
        title: 'Error',
        description: 'No event data',
        variant: 'destructive'
      })
      return
    }

    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description: 'You have already registered for' + eventMap.get(eventType),
        variant: 'destructive'
      })
      return
    }

    const resp = await postCreateEventTeam({
      client: useAuth,
      body: { eventId: eventType, name: team_name }
    })

    // console.log(JSON.stringify(resp))

    if (resp.error || !resp.data) {
      toast({
        title: 'Failed to register to event',
        // @ts-ignore
        description: resp.error.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Successfully created team',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      setModalState('success create')
      setJoinCode(resp.data.joinCode)
    }
  }

  const joinTeam = async (team_code: string) => {
    if (!eventMap.size) {
      toast({
        title: 'Error',
        description: 'No event data',
        variant: 'destructive'
      })
      return
    }

    if (joinedEvent.includes(eventType)) {
      toast({
        title: 'Already Registered',
        description: 'You have already registered for this event',
        variant: 'destructive'
      })
      return
    }

    const resp = await joinEventTeamByCode({
      client: useAuth,
      body: { teamCode: team_code }
    })

    // console.log(JSON.stringify(resp))

    if (resp.error || !resp.data) {
      toast({
        title: 'Error on joining team',
        // @ts-ignore
        description: resp.error.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Successfully joined team',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
      setModalState('success join')
    }
  }

  if (isFetching) {
    return (
      <div className="">
        <Loading isSmallVariant={true} />
      </div>
    )
  }

  return (
    <div className="p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                onClick={openModal}
                className="flex gap-2 rounded-lg py-2"
                disabled={joinedEvent.includes(eventType)}>
                Register Now
                <Image
                  src="/icons/events/arrow_forward.svg"
                  alt="Arrow Down"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {joinedEvent.includes(eventType)
              ? 'You have already registered'
              : (tooltip ?? 'Register Now')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
          {/* Modal */}
          {!eventMap.get(eventType)?.toLowerCase().includes('data') ? (
            <div className="z-10 mx-4 max-w-[700px] rounded-lg bg-gradient-to-b from-[#2E046A] to-[#0F0123] p-6 px-[65px] py-[38px] shadow-xl">
              <div className="mb-7 flex flex-col items-center gap-0">
                {/* <span className="font-teachers text-xl font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF]">
                  Academya
                </span> */}
                <h2 className="break-words text-center font-teachers text-5xl font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF]">
                  {eventMap.get(eventType)?.toUpperCase()}
                </h2>
              </div>
              <p className="mb-[65px] text-center">
                If you're sure about registering for the {eventMap.get(eventType)} Event,
                you'll be redirected to your dashboard
              </p>
              <Button onClick={registerSolo} className="w-[100%]">
                Register
              </Button>
            </div>
          ) : (
            <div className="relative z-10 mx-6 flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#9747FF] px-3 py-[85px] shadow-xl drop-shadow-[0_0_25px_#7138C0] md:h-auto md:w-auto md:max-w-[722px] md:px-[64px]">
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
                  teamName={teamName ?? ''}
                  setTeamName={setTeamName}
                  registerTeam={registerTeam}
                />
              ) : modalState === 'join' ? (
                <JoinTeamModal
                  eventType={eventType}
                  eventMap={eventMap}
                  setModalState={setModalState}
                  teamCode={teamCode ?? ''}
                  setTeamCode={setTeamCode}
                  joinTeam={joinTeam}
                />
              ) : modalState === 'success create' ? (
                <SuccessCreateModal dashboardUrl={dashboardUrl} code={joinCode ?? ''} />
              ) : modalState === 'success join' ? (
                <SuccessJoinModal dashboardUrl={dashboardUrl} teamName={teamName ?? ''} />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
