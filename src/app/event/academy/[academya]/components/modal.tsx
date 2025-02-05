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
import { SuccessCreateModal, SuccessJoinModal } from './success'
import { useToast } from '~/hooks/use-toast'
import { Input } from '~/app/components/Input'

export default function ModalPopup({
  eventType
}: // eqpginai | Academya - Software Engineer
// oajbedpk | Academya - Data Science
// oqgjwbra | Academya - UI UX
// ogqnrwas | Academya - Project Manager
{
  eventType: 'eqpginai' | 'oajbedpk' | 'oqgjwbra' | 'ogqnrwas'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => {
    setIsModalOpen(false)
    setModalState('initial')
  }
  const useAuth = useAxiosAuth()
  const dashboardUrl = '/dashboard/event'
  const eventMap: Map<string, string> = new Map([
    ['eqpginai', 'Software Engineer'],
    ['oajbedpk', 'Data Science'],
    ['oqgjwbra', 'UI/UX'],
    ['ogqnrwas', 'Project Manager']
  ])

  const [userName, setUsername] = useState('')
  const [modalState, setModalState] = useState('initial')
  const [joinedEvent, setJoinedEvent] = useState<string[]>([])

  //   Ngefetch event yang dah di ikutin
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
        console.log('Event Ids \n' + JSON.stringify(eventIds))
        setJoinedEvent(eventIds)
      }
    }

    getEventTeamData()
  }, [])

  //   Ngefetch user data
  useEffect(() => {
    const getSelf = async () => {
      const res = await getUser({ client: useAuth })
      //   console.log(JSON.stringify(res))

      if (res.error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive'
        })
      }

      if (res.data) {
        setUsername(res.fullName ?? '')
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
        description:
          'You are now registered to Academya UI/UX Event ' +
          eventMap.get(eventType)?.toUpperCase() +
          ' Event',
        variant: 'success'
      })
      setJoinedEvent([...joinedEvent, eventType])
    }
  }

  const registerTeam = async (team_name: string) => {
    // if (joinedEvent.includes(eventType)) {
    //   toast({
    //     title: 'Already Registered',
    //     description: 'You have already registered for this event',
    //     variant: 'destructive'
    //   })
    //   return
    // }

    const resp = await postCreateEventTeam({
      client: useAuth,
      path: { eventId: eventType },
      body: { name: team_name }
    })

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

    console.log(JSON.stringify(resp))

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
    }
    setModalState('success join')
  }

  const title = 'Software Engineering'
  return (
    <div className="p-4">
      <Button
        onClick={openModal}
        className="flex gap-2"
        // disabled={joinedEvent.includes(eventType)}
      >
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
                If you’re sure about registering for the Academya{' '}
                {eventMap.get(eventType)} Event, you’ll be redirected to your dashboard
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
                <>
                  {/* Header */}
                  <div className="mb-3 flex flex-col items-center gap-0">
                    <h2 className="break-words text-center font-teachers text-base font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:text-[32px]">
                      Academya{' '}
                      <span className="text-teal-300">{eventMap.get(eventType)}</span>{' '}
                      Registration
                    </h2>
                  </div>
                  <p className="mb-16 text-center text-[14px] md:text-base">
                    Build your team or join forces with others
                  </p>

                  {/* Button Create*/}
                  <div className="flex items-center justify-center gap-4 md:gap-[88px]">
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src="/icons/events/person_add_alt_1.svg"
                        alt="Arrow Down"
                        width={64}
                        height={64}
                        className="h-8 w-8 md:h-16 md:w-16"
                      />
                      <Button
                        onClick={() => setModalState('create')}
                        className="flex w-[166px] gap-2 rounded-xl">
                        Create Team
                        <Image
                          src="/icons/events/arrow_forward.svg"
                          alt="Arrow Down"
                          width={24}
                          height={24}
                        />
                      </Button>
                    </div>

                    {/* Button Join */}
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src="/icons/events/person_search.svg"
                        alt="Arrow Down"
                        width={64}
                        height={64}
                        className="h-8 w-8 md:h-16 md:w-16"
                      />
                      <Button
                        onClick={() => setModalState('join')}
                        className="flex w-[166px] gap-2 rounded-xl">
                        Join Team
                        <Image
                          src="/icons/events/arrow_forward.svg"
                          alt="Arrow Down"
                          width={24}
                          height={24}
                        />
                      </Button>
                    </div>
                  </div>
                </>
              ) : modalState === 'create' ? (
                <>
                  <div className="flex flex-col items-start gap-4 md:flex-row">
                    <div
                      className="cursor-pointer transition duration-200 ease-in-out hover:drop-shadow-[0_0_10px_#C8A2C8]"
                      onClick={() => setModalState('initial')}>
                      <Image
                        src="/icons/events/arrow_forward.svg"
                        alt="Arrow Down"
                        width={32}
                        height={32}
                        style={{ transform: 'rotate(180deg)' }}
                      />
                    </div>
                    <div>
                      <h2 className="break-words px-2 text-center font-teachers text-[16px] font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:px-0 md:text-start md:text-[20px]">
                        Create Team for Academya Data Science
                      </h2>
                      <p className="mb-16 px-2 text-center text-[14px] md:px-0 md:text-start md:text-base">
                        Once you create a team name you can invite others.
                      </p>

                      <div className="flex flex-col gap-1 px-4 md:px-0">
                        <div className="mb-6 flex flex-col gap-2">
                          <p className="text-lilac-200">
                            Team Name
                            <span className="text-red-500"> *</span>
                          </p>
                          <div className="md:w-[556px]">
                            <Input
                              className="w-full"
                              placeholder="Enter your team name"
                              value={userName}
                              onChange={e => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          className="w-[100%] rounded-xl"
                          onClick={() => registerTeam(userName)}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : modalState === 'join' ? (
                <>
                  <div className="flex flex-col items-start gap-4 md:flex-row">
                    <div
                      className="cursor-pointer transition duration-200 ease-in-out hover:drop-shadow-[0_0_10px_#C8A2C8]"
                      onClick={() => setModalState('initial')}>
                      <Image
                        src="/icons/events/arrow_forward.svg"
                        alt="Arrow Down"
                        width={32}
                        height={32}
                        style={{ transform: 'rotate(180deg)' }}
                      />
                    </div>
                    <div>
                      <h2 className="break-words px-2 text-center font-teachers text-[16px] font-bold text-[#F5E1FF] drop-shadow-[0_0_13.1px_#CE6AFF] md:px-0 md:text-start md:text-[20px]">
                        Join Team for Academya Data Science
                      </h2>
                      <p className="mb-16 px-2 text-center text-[14px] md:px-0 md:text-start md:text-base">
                        Enter your team code to join
                      </p>

                      <div className="flex flex-col gap-1 px-4 md:px-0">
                        <div className="mb-6 flex flex-col gap-2">
                          <p className="text-lilac-200">
                            Team Code
                            <span className="text-red-500"> *</span>
                          </p>
                          <div className="md:w-[556px]">
                            <Input
                              className="w-full"
                              placeholder="Enter your team code"
                              value={userName}
                              onChange={e => setUsername(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          className="w-[100%] rounded-xl"
                          onClick={() => joinTeam(userName)}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : modalState === 'success create' ? (
                <SuccessCreateModal dashboardUrl={dashboardUrl} code="ABC123" />
              ) : modalState === 'success join' ? (
                <SuccessJoinModal dashboardUrl={dashboardUrl} teamName="Data Science" />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
