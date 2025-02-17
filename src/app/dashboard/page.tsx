'use client'
import React, { useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  getTeams,
  Team,
  getUser,
  getCompetitionTimelineWithCompetitionId,
  GetCompetitionTimelineWithCompetitionIdResponse,
  GetCompetitionTimelineWithCompetitionIdData,
  getTeamSubmission,
  EventTeam,
  GetEventTimelineByIdResponse,
  getEventTeam,
  GetEventTeamResponse,
  getEventTimelineById
} from '~/api/generated'
import { toast } from '~/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Button } from '../components/Button'
import Link from 'next/link'
import Image from 'next/image'

import Category from './components/Category'
import Calendar from '../components/CustomCalendar/CustomCalendar'
import Countdown from './components/Countdown'
import ComponentBox from './components/ComponentBox'
import Information from './components/Information/Information'
import Submisi from './components/Submisi'
import Tag from '../components/Tag'
import Dropdown, { MenuItem } from '../components/Dropdown'
import { expandCompetitionName } from '~/lib/utils'
import { useAppSelector } from '~/redux/store'
import DashboardCompePicker from './components/DashboardCompePicker'
import Loading from '../components/Loading'

export interface ExtendedMenuItem extends MenuItem {
  competitionId: string
  type: 'Competition' | 'Event'
}

interface Information {
  id: string
  title: string
  datetime: string
  content: string
}

type TeamOrEventTeam = Team | EventTeam;

const transformEventData = (
  data: { startDate: string; endDate: string | null; title: string }[]
) => {
  const events: { date: Date; information: string }[] = []

  data.forEach(item => {
    if (item.startDate) {
      events.push({
        date: new Date(item.startDate),
        information: item.title
      })
    }

    if (item.endDate) {
      events.push({
        date: new Date(item.endDate),
        information: `Closing ${item.title}`
      })
    }
  })

  // Urutkan berdasarkan tanggal
  events.sort((a, b) => a.date.getTime() - b.date.getTime())

  return events
}

const transformSubmissionData = (
  submissionData: {
    requirement: { typeName: string; startDate: string; deadline: string }
  }[]
) => {
  const now = new Date()
  const submissions = submissionData
    .filter(item => new Date(item.requirement.startDate) >= now) // Filter berdasarkan startDate
    .map(item => ({
      title: item.requirement.typeName,
      link: '#',
      date: new Date(item.requirement.deadline)
    }))

  return submissions
}

const getTeamStage = (
  submissionData: {
    requirement: { stage: string; startDate: string; deadline: string }
  }[]
) => {
  const now = new Date()
  const validStages = submissionData.filter(
    item =>
      new Date(item.requirement.startDate) <= now &&
      now <= new Date(item.requirement.deadline)
  )

  if (validStages.length === 0) {
    return null
  }

  const selectedStage = validStages.reduce((earliest, current) =>
    new Date(current.requirement.startDate) < new Date(earliest.requirement.startDate)
      ? current
      : earliest
  )

  return {
    stage: selectedStage.requirement.stage,
    deadline: new Date(selectedStage.requirement.deadline)
  }
}

const getNearestDeadline = (data: GetCompetitionTimelineWithCompetitionIdResponse) => {
  const now = new Date()
  const deadlines = data
    .filter(item => new Date(item.endDate || item.startDate) >= now) // Filter berdasarkan startDate
    .map(item => ({
      date: new Date(item.endDate || item.startDate),
      stageName: item.title
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (deadlines.length === 0) {
    return null
  }

  const nearestDeadline = deadlines.reduce((earliest, current) =>
    current < earliest ? current : earliest
  )

  return nearestDeadline
}

function UserDashboard() {
  const [hasCompetitions, setHasCompetitions] = React.useState(true)
  const [userTeams, setUserTeams] = React.useState<TeamOrEventTeam[]>([])
  const [userName, setUserName] = React.useState(
    useAppSelector(state => state.auth.username)
  )
  const [currentTeam, setCurrentTeam] = React.useState<TeamOrEventTeam>()
  const [options, setOptions] = React.useState<ExtendedMenuItem[]>([])
  const [currentCompetition, setCurrentCompetition] = React.useState<ExtendedMenuItem>()
  const [isLoading, setIsLoading] = React.useState(true)

  const axiosAuth = useAxiosAuth()
  const router = useRouter()
  const [competitionTimeline, setCompetitionTimeline] =
    React.useState<GetCompetitionTimelineWithCompetitionIdResponse>()
  const [eventTimeline, setEventTimeline] = 
    React.useState<GetEventTimelineByIdResponse>();
  const [submissionRequirementData, setSubmissionRequirementData] = React.useState<any>()

  // Fetching user name
  useEffect(() => {
    async function fetchUserInfo() {
      const userData = await getUser({ client: axiosAuth })

      if (userData.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user name',
          variant: 'destructive'
        })
      }

      if (userData.data?.fullName) {
        setUserName(userData.data.fullName)
      }
    }

    fetchUserInfo()
  }, [])

  // Fetching user teams
  useEffect(() => {
    async function fetchTeams() {
      const userTeam = await getTeams({ client: axiosAuth })
      const eventTeam = await getEventTeam({ client: axiosAuth })
      let length = 0

      if (userTeam.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user competitions',
          variant: 'destructive'
        })
      }

      if (eventTeam.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get event teams',
          variant: 'destructive'
        })
      }

      if (userTeam.data) {
        if (userTeam.data.length > 0) {
          length = userTeam.data.length
          const competitions = userTeam.data.toSorted((a, b) =>
            // @ts-ignore
            expandCompetitionName(a.competition!.title).localeCompare(
              expandCompetitionName(b.competition!.title)
            )
          )
          const options: ExtendedMenuItem[] = competitions.map(
            (team: Team, index: number) => ({
              id: index,
              option: expandCompetitionName(team.competition!.title),
              competitionId: team.competition!.id,
              type: 'Competition' as 'Competition'
            })
          )

          setOptions(options)
          setUserTeams(competitions)
          setCurrentTeam(competitions[0])
          setCurrentCompetition(options[0])

          // console.log('currentTeam: ' + currentTeam.name)
          // @ts-ignore
          // router.push(`/dashboard/${chosenCompetition.competition.title.toLowerCase()}`)
        } else {
          setHasCompetitions(false)
        }
      }

      if (eventTeam.data) {
        if (eventTeam.data.length > 0) {
          const competitions = eventTeam.data.toSorted((a, b) =>
            // @ts-ignore
            expandCompetitionName(a.event!.title).localeCompare(
              expandCompetitionName(b.event!.title)
            )
          )
          const options: ExtendedMenuItem[] = competitions.map(
            (team: any, index: number) => ({
              id: index + length,
              option: team.event.title,
              competitionId: team.event!.id,
              type: 'Event' as 'Event'
            })
          )

          setOptions((prevOptions: ExtendedMenuItem[]) => [...prevOptions, ...options])
          setUserTeams((prevTeams: TeamOrEventTeam[]) => [...prevTeams, ...competitions])

          // @ts-ignore
          // router.push(`/dashboard/${chosenCompetition.competition.title.toLowerCase()}`)
        }
      }

      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }

    fetchTeams()
  }, [])

  useEffect(() => {
    async function fetchTimeline() {
      if (currentTeam) {
        if ('competition' in currentTeam) {
          // Ini adalah Team
          const competitionData = await getCompetitionTimelineWithCompetitionId({
            client: axiosAuth,
            path: { competitionId: currentTeam.competition!.id }
          });
  
          if (competitionData.error) {
            toast({
              title: 'Failed getting data',
              description: 'Failed to get competition data',
              variant: 'destructive'
            });
          }
  
          if (competitionData.data) {
            setCompetitionTimeline(competitionData.data);
          }
        } else if ('event' in currentTeam) {
          // Ini adalah EventTeam
          const eventTimeline = await getEventTimelineById({
            client: axiosAuth,
            path: { eventId: currentTeam.event!.id }
          });
  
          if (eventTimeline.error) {
            toast({
              title: 'Failed getting data',
              description: 'Failed to get event timeline',
              variant: 'destructive'
            });
          }
  
          if (eventTimeline.data) {
            setEventTimeline(eventTimeline.data);
          }
        }
      }
    }
  
    fetchTimeline();
  }, [currentTeam]);

  // Fetching stage and submission
  useEffect(() => {
    async function fetchSubmission() {
      if (currentTeam) {
        const submissionData = await getTeamSubmission({
          client: axiosAuth,
          path: { teamId: currentTeam.id }
        })

        if (submissionData.error) {
          toast({
            title: 'Failed getting data',
            description: 'Failed to get submission data',
            variant: 'destructive'
          })
        }

        if (submissionData.data) {
          // console.log('submissionData: ' + JSON.stringify(submissionData.data))
          setSubmissionRequirementData(submissionData.data)
        }
      }
    }
    fetchSubmission()
  }, [currentTeam])

  // // Fetching Informations => issue, api masih untuk role admin saja
  // useEffect(() => {
  //   async function fetchInformations() {
  //     const adminCompAnnouncement = await getAdminCompAnnouncement({
  //       client: axiosAuth,
  //       path: { competitionId: currentTeam?.competition.id } // typo di setup api nya jd competititon
  //     })

  //     if (adminCompAnnouncement.error) {
  //       toast({
  //         title: 'Failed getting data',
  //         description: 'Failed to get admin competition announcement',
  //         variant: 'destructive'
  //       })
  //     }

  //     if (adminCompAnnouncement.data) {
  //       console.log(
  //         'adminCompAnnouncement: ' + JSON.stringify(adminCompAnnouncement.data)
  //       )
  //     }
  //   }
  //   fetchInformations()
  // }, [])

  let team_stage = ''
  let stage_name = ''
  let stage_deadline = null
  if (submissionRequirementData) {
    // team_stage = (getTeamStage(submissionRequirementData)?.stage || '')
    //   .split(' ')
    //   .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    //   .join(' ')
    // stage_deadline = getTeamStage(submissionRequirementData)?.deadline
  }

  const events = []
  if (competitionTimeline) {
    team_stage = currentTeam?.stage
      ? currentTeam.stage.charAt(0).toUpperCase() + currentTeam.stage.slice(1)
      : 'placeholder-stage'
    const event_stage = getNearestDeadline(competitionTimeline)
    stage_deadline = event_stage?.date
    stage_name = event_stage?.stageName || 'placeholder-stage'
    const transformedData = transformEventData(competitionTimeline)
    events.push(...transformedData)
  }

  const submissions = []
  if (submissionRequirementData) {
    const transformedSubmissionData = transformSubmissionData(submissionRequirementData)
    submissions.push(...transformedSubmissionData)
  }

  // Masih dummy data
  const informations: Array<Information> = [
    // {
    //   id: '1',
    //   title: 'Judul Informasi',
    //   datetime: '20/01/2024, 10:00 WIB',
    //   content:
    //     'Lorem ipsum dolor sit amet consectetur. Nullam lacus nunc nullam molestie odio ornare.'
    // },
    // {
    //   id: '2',
    //   title: 'Judul Informasi',
    //   datetime: '19/01/2024, 15:30 WIB',
    //   content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    // },
    // {
    //   id: '3',
    //   title: 'Judul Informasi',
    //   datetime: '18/01/2024, 09:15 WIB',
    //   content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    // }
  ]

  const handleDropdownChange = (selectedCompetition: ExtendedMenuItem) => {
    setCurrentCompetition(selectedCompetition);
    const selectedTeam = userTeams.find(team => {
      if (selectedCompetition.type === 'Competition') {
        return (team as Team).competition?.id === selectedCompetition.competitionId;
      } else {
        return (team as EventTeam).event?.id === selectedCompetition.competitionId;
      }
    });
    setCurrentTeam(selectedTeam);
  };

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full flex-col">
        <Loading />
      </div>
    )
  } else {
    return (
      <>
        {!hasCompetitions ? (
          <div className="relative h-screen w-full">
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-y-3">
              <div className="text-center font-belanosima text-[20px]">
                Tidak ada kompetisi !
              </div>
              <Link href="/competition">
                <Button>Cari kompetisi untuk diikuti</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full w-full flex-col">
            {/* Title */}
            <div className="mb-4 xl:mb-5">
              <div className="flex items-center gap-x-2">
                <Image
                  src="/icons/userDashboardLogo.png"
                  alt="Dashboard Logo"
                  width={37.5}
                  height={37.5}
                />
                <p className="dashboardTitle font-belanosima text-[32px] xl:text-[48px]">
                  Dashboard
                </p>
              </div>
              <div className="dashboardSeparator mt-4 h-1.5 rounded"></div>
            </div>

            <section className="flex w-full flex-col gap-6 lg:flex-row lg:justify-between xl:flex-wrap xl:gap-[45px]">
              {/* left section */}
              <section className="flex flex-col gap-6 lg:gap-8 lg:flex-grow">
                {/* Header */}
                <div>
                  {/* Title */}
                  <div
                    id="header"
                    className="mb-2 flex w-full items-center justify-between">
                    <p className="mb-2 grow font-belanosima text-[24px] md:text-[28px] lg:text-[34px] xl:text-[46px]">
                      Hi, {userName}!
                    </p>
                    <DashboardCompePicker
                      onChange={handleDropdownChange}
                      options={options}
                    />
                  </div>

                  {/* Team Information */}
                  <div className="mt-5 flex flex-col gap-[18px] text-white lg:flex-row lg:justify-between">
                    <div className="flex flex-col gap-[6px]">
                      {/* Team Name */}
                      <div className="flex items-center">
                        <span className="w-[84px] font-dmsans text-xs md:text-[14px] lg:text-[18px] xl:text-base">
                          Team
                        </span>
                        <span className="w-4">:</span>
                        <span className="lg:text- max-w-[200px] break-words font-teachers text-[14px] font-bold md:text-[16px] lg:text-[18px] xl:text-base">
                          {currentTeam?.name}
                        </span>
                      </div>
                      {/* Kategori */}
                      <div className="flex items-center">
                        <span className="w-[84px] font-dmsans text-xs md:text-[14px] lg:text-[18px] xl:text-base">
                          Kategori
                        </span>
                        <span className="w-4">:</span>
                        <Category
                          categoryName={
                            currentTeam
                              ? 'competition' in currentTeam
                                ? expandCompetitionName(currentTeam.competition!.title)
                                : 'event' in currentTeam ? currentTeam.event!.title : ''
                              : ''
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      {/* Team Status */}
                      <div className="flex items-center">
                        <span className="w-[120px] font-dmsans text-xs md:text-[14px] lg:text-[16px] xl:text-base">
                          Team Status
                        </span>
                        <Tag
                          variant={
                            currentTeam?.verificationStatus === 'VERIFIED'
                              ? 'success'
                              : 'warning'
                          }
                          text={currentTeam?.verificationStatus ?? 'No data'}
                          className="w-[116px] xl:w-40"
                        />
                      </div>

                      {/* Team Stage */}
                      <div className="flex items-center">
                        <span className="w-[120px] font-dmsans text-xs md:text-[14px] lg:text-[16px] xl:text-base">
                          Team Stage
                        </span>
                        <Tag
                          variant="pink"
                          text={team_stage}
                          className="w-[116px] xl:w-40"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown */}
                <div className="lg:hidden">
                  <Countdown eventName={stage_name} eventDate={stage_deadline} />
                </div>

                {/* Pengunguman */}
                <Information informations={informations} />

                {/* Submisi */}
                <div className="hidden lg:block">
                  <Submisi submissions={submissions} />
                </div>
              </section>

              {/* Right section */}
              <section className="flex w-full flex-col gap-6 lg:w-auto lg:gap-8">
                {/* Submisi */}
                <div className="lg:hidden">
                  <Submisi submissions={submissions} />
                </div>

                {/* Countdown */}
                <div className="hidden lg:block">
                  <Countdown eventName={stage_name} eventDate={stage_deadline} />
                </div>

                {/* Calendar */}
                <ComponentBox title="Calendar" morespace={true}>
                  <div className="flex flex-col">
                    <Calendar eventDate={events} />
                    {/* Informasi event */}
                    <div className="mt-[23px] grid grid-rows-4 self-start">
                      {events &&
                        events.map((event, index) => (
                          <div className="flex items-center gap-2" key={index}>
                            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FF71A0] to-[#CE6AFF]"></div>
                            <h6 className="text-[14px] font-semibold lg:text-[12px] xl:text-[14px]">
                              {String(event.date.getDate()).padStart(2, '0')}/
                              {String(event.date.getMonth() + 1).padStart(2, '0')}/
                              {String(event.date.getFullYear()).slice(-2)}
                            </h6>
                            <p className="text-[14px] lg:text-[12px] xl:text-[14px]">
                              : {event.information}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </ComponentBox>
              </section>
            </section>
          </div>
        )}
      </>
    )
  }
}

export default UserDashboard
