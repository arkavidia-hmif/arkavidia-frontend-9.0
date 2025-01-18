'use client'
import React, { useEffect } from 'react'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import {
  getTeams,
  Team,
  getUser,
  User,
  getCompetitionSubmissionTeam,
  GetCompetitionSubmissionTeamData,
  getCompetitionTimelineWithCompetitionId,
  GetCompetitionTimelineWithCompetitionIdData,
  getCompetitionTimeline,
  GetCompetitionTimelineData
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

function UserDashboard() {
  const [hasCompetitions, setHasCompetitions] = React.useState(true)
  const [userTeams, setUserTeams] = React.useState<Team[]>()
  const [userName, setUserName] = React.useState('')
  const [currentTeam, setCurrentTeam] = React.useState<Team>()
  const axiosAuth = useAxiosAuth()
  const router = useRouter()

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
        console.log('userResponse: ' + JSON.stringify(userData))
        setUserName(userData.data.fullName)
      }
    }

    fetchUserInfo()
  })

  // Fething user teams
  useEffect(() => {
    async function fetchTeams() {
      const userTeam = await getTeams({ client: axiosAuth })

      if (userTeam.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user competitions',
          variant: 'destructive'
        })
      }

      if (userTeam.data) {
        if (userTeam.data.length > 0) {
          const competitions = userTeam.data.toSorted((a, b) =>
            // @ts-ignore
            a.competition.title.localeCompare(b.competition.title)
          )
          console.log('competitions: ' + JSON.stringify(competitions))

          setUserTeams(competitions)
          setCurrentTeam(competitions[0])
          console.log('currentTeam: ' + currentTeam.name)
          // @ts-ignore
          // router.push(`/dashboard/${chosenCompetition.competition.title.toLowerCase()}`)
        } else {
          setHasCompetitions(false)
        }
      }
    }

    fetchTeams()
  }, [])

  // Fetching competition info
  // useEffect(() => {
  //   async function fetchCompetitionInfo() {
  //     if (currentTeam) {
  //       console.log('Masuk ouu ke fetch competition')
  //       const competitionSubmission = await getCompetitionSubmissionTeam({
  //         client: axiosAuth,
  //         teamId: currentTeam.id
  //       })

  //       if (competitionSubmission.error) {
  //         toast({
  //           title: 'Failed getting data',
  //           description: 'Failed to get competition data',
  //           variant: 'destructive'
  //         })
  //       }

  //       if (competitionSubmission.data) {
  //         console.log('competitionSubmission: ' + JSON.stringify(competitionSubmission))
  //       }
  //     }
  //   }

  //   fetchCompetitionInfo()
  // }, [currentTeam])

  // Fetching competition timeline
  useEffect(() => {
    async function fetchCompetitionTimeline() {
      if (currentTeam) {
        console.log('Masuk ouu ke fetch timeline')
        const competitionTimeline = await getCompetitionTimeline({
          client: axiosAuth
        })

        if (competitionTimeline.error) {
          toast({
            title: 'Failed getting data',
            description: 'Failed to get competition timeline',
            variant: 'destructive'
          })
        }

        if (competitionTimeline.data) {
          console.log('competitionTimeline: ' + JSON.stringify(competitionTimeline))
        }
      }
    }

    fetchCompetitionTimeline()
  }, [currentTeam])

  // Dummy Data
  const username = userName
  const team = currentTeam?.name
  const category = currentTeam?.competition.title
  const team_status = currentTeam?.isVerified
  const informations = [
    {
      id: '1',
      title: 'Judul Informasi',
      datetime: '20/01/2024, 10:00 WIB',
      content:
        'Lorem ipsum dolor sit amet consectetur. Nullam lacus nunc nullam molestie odio ornare.'
    },
    {
      id: '2',
      title: 'Judul Informasi',
      datetime: '19/01/2024, 15:30 WIB',
      content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      id: '3',
      title: 'Judul Informasi',
      datetime: '18/01/2024, 09:15 WIB',
      content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
    }
  ]
  const events: { date: Date; information: string }[] = [
    { date: new Date('2025-01-10'), information: 'Hari Raya' },
    { date: new Date('2025-01-16'), information: 'Hari Besar' },
    { date: new Date('2025-01-25'), information: 'Hari Berbahagia' }
  ]
  const submissions = [
    {
      title: 'Tugas 1',
      link: '/tugas1'
    },
    {
      title: 'Tugas 2',
      link: '/tugas2'
    },
    {
      title: 'Tugas 3',
      link: '/tugas3'
    }
  ]

  return (
    <>
      {!hasCompetitions ? (
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-y-3">
          <div className="text-center font-belanosima text-[20px]">
            No competitions joined yet!
          </div>
          <Link href="/">
            <Button>Find a competition to join</Button>
          </Link>
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

          <section className="flex w-full flex-col gap-6 xl:flex-row xl:flex-wrap xl:justify-between xl:gap-[45px]">
            {/* left section */}
            <section className="flex flex-col gap-6 xl:flex-grow xl:gap-8">
              {/* Header */}
              <div>
                {/* Title */}
                <p className="mb-4 font-belanosima text-[24px] xl:text-[48px]">
                  Hi, {username}!
                </p>

                {/* Team Information */}
                <div className="flex flex-col gap-[18px] text-white xl:flex-row xl:justify-between">
                  <div className="flex flex-col gap-[6px]">
                    {/* Team Name */}
                    <div className="flex items-center">
                      <span className="w-[84px] font-dmsans text-xs xl:text-base">
                        Team
                      </span>
                      <span className="w-4">:</span>
                      <span className="max-w-[200px] break-words font-teachers text-[14px] font-bold xl:text-base">
                        {team}
                      </span>
                    </div>
                    {/* Kategori */}
                    <div className="flex items-center">
                      <span className="w-[84px] font-dmsans text-xs xl:text-base">
                        Kategori
                      </span>
                      <span className="w-4">:</span>
                      <Category categoryName={category} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    {/* Team Status */}
                    <div className="flex items-center">
                      <span className="w-[100px] font-dmsans text-xs xl:text-base">
                        Team Status
                      </span>
                      <Tag
                        variant={team_status ? 'success' : 'warning'}
                        text={team_status ? 'Verified' : 'Unverified'}
                        className="w-[116px] xl:w-40"
                      />
                    </div>

                    {/* Team Stage */}
                    <div className="flex items-center">
                      <span className="w-[100px] font-dmsans text-xs xl:text-base">
                        Team Stage
                      </span>
                      <Tag
                        variant="pink"
                        text="Pre-eliminary"
                        className="w-[116px] xl:w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="xl:hidden">
                <Countdown
                  eventName="Penyisihan"
                  eventDate={new Date('2026-01-01T00:00:00')}
                />
              </div>

              {/* Pengunguman */}
              <Information informations={informations} />

              {/* Submisi */}
              <div className="hidden xl:block">
                <Submisi submissions={submissions} />
              </div>
            </section>

            {/* Right section */}
            <section className="flex w-full flex-col gap-6 xl:w-auto xl:gap-8">
              {/* Submisi */}
              <div className="xl:hidden">
                <Submisi submissions={submissions} />
              </div>

              {/* Countdown */}
              <div className="hidden xl:block">
                <Countdown
                  eventName="Penyisihan"
                  eventDate={new Date('2026-01-01T00:00:00')}
                />
              </div>

              {/* Calendar */}
              <ComponentBox title="Calendar" morespace={true}>
                <div className="x flex flex-col">
                  <Calendar eventDate={events} />
                  {/* Informasi event */}
                  <div className="mt-[23px] flex flex-col self-start">
                    {events &&
                      events.map((event, index) => (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#FF71A0] to-[#CE6AFF]"></div>
                          <h6 className="text-[14px] font-semibold">
                            {String(event.date.getDate()).padStart(2, '0')}/
                            {String(event.date.getMonth() + 1).padStart(2, '0')}/
                            {String(event.date.getFullYear()).slice(-2)}
                          </h6>
                          <p className="text-[14px]">: {event.information}</p>
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

export default UserDashboard
