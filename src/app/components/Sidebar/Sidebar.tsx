'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronUp, LogOut, Menu, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  getTeams,
  GetTeamsResponse,
  getEventTeam,
  GetEventTeamResponse,
  getEventById,
  GetEventByIdResponse,
  getAdminCompetitions,
  GetAdminCompetitionsResponse,
  getEvent,
  GetEventResponse,
  type Event as EventType
} from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useAppSelector } from '~/redux/store'
import { useToast } from '~/hooks/use-toast'
import { useAuth } from '../../contexts/AuthContext'
import { expandCompetitionName, expandEventName } from '~/lib/utils'
import SidebarItem from './SidebarItems'
import { getSidebarURL } from './SidebarLinks'

const CollapsibleSection = ({
  title,
  links,
  defaultOpen = true
}: {
  title: string
  links: SidebarLink[]
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
        <span className="font-teachers text-base font-bold sm:text-lg">{title}</span>
        <ChevronUp
          className={`h-5 w-5 transition-transform duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'
        }`}>
        {links.map((item, index) => (
          <SidebarItem
            key={index}
            name={item.name}
            link={item.link}
            image={item.image}
            className="mt-3 pl-4 text-sm sm:text-base"
          />
        ))}
      </div>
    </div>
  )
}

export interface SidebarProps {
  announcement?: boolean
}

interface SidebarLink {
  name: string
  link: string
  image?: string
  type?: 'competition' | 'event' | null
}

function Sidebar({ announcement = false }: SidebarProps) {
  const username = useAppSelector(state => state.auth.username)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [sidebarLinks, setSidebarLinks] = React.useState<Array<SidebarLink>>([])
  const [hasScrolled, setHasScrolled] = React.useState(false)

  const { toast } = useToast()
  const { logout } = useAuth()
  const router = useRouter()
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const authAxios = useAxiosAuth()

  useEffect(() => {
    async function fetchSidebarLinks() {
      // Initialize with the dashboard link
      const links: Array<SidebarLink> = [
        {
          name: 'Dashboard',
          link: '/dashboard'
        }
      ]

      // Fetch Competitions
      const teamsRes = await getTeams({ client: authAxios })

      if (teamsRes.error) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user competitions',
          variant: 'destructive'
        })
      } else if (teamsRes.data) {
        const competitionList = JSON.parse(
          JSON.stringify(teamsRes.data)
        ) as GetTeamsResponse

        competitionList.forEach(competition => {
          links.push({
            name: expandCompetitionName(competition.competition!.title),
            link: getSidebarURL({
              isAdmin,
              competitionName: competition.competition!.title
            }),
            type: 'competition'
          })
        })
      }

      // Fetch Events
      const eventTeamRes = await getEventTeam({ client: authAxios })

      if (eventTeamRes.error || eventTeamRes.status !== 200) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get user events',
          variant: 'destructive'
        })
      } else {
        const eventList = JSON.parse(
          JSON.stringify(eventTeamRes.data)
        ) as GetEventTeamResponse

        for (const event of eventList) {
          const eventRes = await getEventById({
            client: authAxios,
            path: { eventId: event.eventId }
          })

          if (eventRes.error || eventRes.status !== 200) {
            toast({
              title: 'Failed getting data',
              description: 'No event with this type',
              variant: 'destructive'
            })
          } else {
            // @ts-expect-error
            const eventData = eventRes.data as EventType

            links.push({
              name: expandEventName(eventData.title),
              link: getSidebarURL({ isAdmin, eventName: eventData.title }),
              type: 'event'
            })
          }
        }
      }

      setSidebarLinks(links)
    }

    async function fetchSidebarLinksAdmin() {
      const links: Array<SidebarLink> = [
        {
          name: 'Dashboard',
          link: '/dashboard'
        }
      ]

      // Fetch competition
      const resComp = await getAdminCompetitions({ client: authAxios })

      if (resComp.error || resComp.status !== 200) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get competitions',
          variant: 'destructive'
        })
      }

      const competitionList = JSON.parse(
        JSON.stringify(resComp.data)
      ) as GetAdminCompetitionsResponse

      // Add competition to sidebar
      competitionList.forEach(competition => {
        links.push({
          name: expandCompetitionName(competition.title),
          link: getSidebarURL({
            isAdmin: true,
            competitionName: competition.title
          }),
          type: 'competition'
        })
      })

      // Fetch all events
      const resEvents = await getEvent({ client: authAxios })

      if (resEvents.error || resEvents.status !== 200) {
        toast({
          title: 'Failed getting data',
          description: 'Failed to get events',
          variant: 'destructive'
        })
      }

      const eventList = JSON.parse(JSON.stringify(resEvents.data)) as GetEventResponse

      eventList.forEach(event => {
        links.push({
          name: expandEventName(event.title),
          link: getSidebarURL({
            isAdmin: true,
            eventName: event.title
          }),
          type: 'event'
        })
      })

      setSidebarLinks(links)
    }

    function handleScroll() {
      if (window.scrollY > 0) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    if (!isAdmin) {
      fetchSidebarLinks()
    } else {
      // setSidebarLinks(getAdminLinks(authAxios))
      fetchSidebarLinksAdmin()
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const USERNAME = username

  async function handleLogout() {
    await logout()
    setTimeout(() => {
      toast({
        title: 'Logged out',
        description: 'You have been logged out',
        variant: 'success'
      })
      router.replace('/')
    }, 1000)
  }

  // Group links by type
  const dashboardLinks = sidebarLinks.filter(link => !link.type)
  const competitionLinks = sidebarLinks.filter(link => link.type === 'competition')
  const eventLinks = sidebarLinks.filter(link => link.type === 'event')

  return (
    <>
      <div
        className={`fixed z-50 flex w-full items-center justify-between p-4 lg:hidden ${
          hasScrolled ? 'bg-black/40 lg:bg-none' : ''
        }`}>
        <Link href="/">
          <Image
            src="/arkavidiaLogo.svg"
            alt="Logo Arkavidia 9.0"
            width={24}
            height={24}
            className="ml-4 cursor-pointer"
          />
        </Link>
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mr-2 cursor-pointer rounded-lg bg-gradient-to-b from-[#2E046A] to-[#0B1936] p-2">
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      <div
        className={`fixed -left-2 z-50 my-2 h-full w-[200px] -translate-x-full transform overflow-visible rounded-xl bg-cover bg-center bg-no-repeat shadow-[0px_0px_10px_0px_#1B3E88] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-3' : ''
        } lg:left-0 lg:top-0 lg:m-2 lg:block lg:translate-x-0`}
        style={{ backgroundImage: "url('/images/sidebar/bg.svg')" }}>
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
          <div className="relative my-2 flex h-full w-full flex-col items-center justify-start lg:my-6">
            <Link href="/">
              <Image
                src="/images/sidebar/logo.svg"
                alt="Logo Arkavidia 9.0"
                width={100}
                height={100}
              />
            </Link>
            <div className="scrollbar flex h-full flex-col justify-between overflow-y-auto">
              <div className="mt-4 flex w-full grow flex-col gap-5 px-2 lg:mt-7 lg:px-[10px]">
                {sidebarLinks.length ? (
                  <>
                    {/* Dashboard Links */}
                    {dashboardLinks.map((item, index) => (
                      <SidebarItem
                        key={index}
                        name={item.name}
                        link={item.link}
                        image={item.image}
                        className="mt-3 text-sm sm:text-base"
                      />
                    ))}

                    {/* Competition Section */}
                    {competitionLinks.length > 0 && (
                      <CollapsibleSection title="Competitions" links={competitionLinks} />
                    )}

                    {/* Event Section */}
                    {eventLinks.length > 0 && (
                      <CollapsibleSection title="Events" links={eventLinks} />
                    )}
                  </>
                ) : (
                  <div className="px-2 text-center text-sm sm:text-base">
                    No competitions joined!
                  </div>
                )}
              </div>
              <div className="mx-2 mb-4 cursor-pointer lg:mx-2.5">
                <DropdownMenu
                  modal={false}
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger
                    asChild
                    className="my-6 flex w-full items-center gap-2 rounded-xl p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
                    <div className="flex flex-1 items-center gap-2 text-left">
                      <Image
                        src="/profileLogo.svg"
                        alt="Profile Logo"
                        width={20}
                        height={20}
                        className="lg:h-6 lg:w-6"
                      />
                      <span className="truncate text-ellipsis text-sm font-medium text-white lg:text-base">
                        {USERNAME.length > 10 ? `${USERNAME.slice(0, 10)}...` : USERNAME}
                      </span>
                      <ChevronUp
                        className={`m-1 ml-auto h-4 w-4 text-white transition-transform duration-300 ease-in-out lg:h-5 lg:w-5 ${
                          isDropdownOpen ? 'rotate-0' : 'rotate-180'
                        }`}
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="m-auto ml-1 overflow-hidden rounded-md border-transparent bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lilac-200">
                    <Link href="/" className="cursor-pointer">
                      <DropdownMenuItem className="cursor-pointer rounded-lg text-white focus:text-white/80">
                        <Image
                          src="/images/sidebar/landing-page.svg"
                          alt="Landing Page Icon"
                          width={16}
                          height={18}
                          className="mr-2 h-4 w-4"
                        />
                        Landing Page
                      </DropdownMenuItem>
                    </Link>
                    {!isAdmin && (
                      <Link href="/dashboard/profile" className="cursor-pointer">
                        <DropdownMenuItem className="flex cursor-pointer gap-x-2 rounded-lg text-white focus:text-white/80">
                          <Image
                            src="/images/sidebar/face.svg"
                            alt="Profile Icon"
                            width={16}
                            height={16}
                            className="mr-2 h-4 w-4"
                          />
                          <p>Profile</p>
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-lg text-red-500 focus:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="pointer-events-auto fixed inset-0 z-40 bg-black opacity-50 transition-opacity duration-300" />
      )}
    </>
  )
}

export default Sidebar
