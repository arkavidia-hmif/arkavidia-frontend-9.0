'use client'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'
import { Pagination } from '../Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import Tag from '../Tag'
import { Input } from '../ui/input'
import { Search, Pencil } from 'lucide-react'
import { EventTeam } from '~/api/generated'
import Link from 'next/link'
import { capitalizeFirstLetter } from '~/lib/utils'
import PaginationComponent from './Pagination'

interface Pagination {
  currentPage: number
  totalItems: number
  totalPages: number
  next: string | null
  prev: string | null
}

interface RegisteredTeamListProps {
  teamData: EventTeam[]
  pagination: Pagination
  eventId: string | 'null'
  currentSearchFilter: string
  filterStates: {
    teamStatusFilter: Exclude<EventTeam['verificationStatus'], null> | undefined
    teamStageFilter: EventTeam['stage'] | undefined
  }
  currentPage: number
  itemsPerPage: string
  onPageChange: (newPage: number) => void // Callback for handling page changes
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>
  setTeamStageFilter: React.Dispatch<React.SetStateAction<EventTeam['stage'] | undefined>>
  setTeamStatusFilter: React.Dispatch<
    React.SetStateAction<Exclude<EventTeam['verificationStatus'], null> | undefined>
  >
  onSearchClick: () => void
}

//! HARDCODED
// Function to get team status
export const getTeamStatus = (team: EventTeam) => {
  return team.verificationStatus
}

export type TeamStatus = EventTeam['verificationStatus']

//! HARDCODED
export const possibleTeamStatus: Array<NonNullable<TeamStatus>> = [
  'INCOMPLETE',
  'VERIFIED',
  'DENIED',
  'WAITING',
  'CHANGED',
  'ON REVIEW'
]

//! HARDCODED
// Map status to their tag color
export const mapStatusTag: Record<
  string,
  | 'success'
  | 'warning'
  | 'danger'
  | 'lilac'
  | 'purple'
  | 'teal'
  | 'pink'
  | 'blue'
  | 'neutral'
> = {
  VERIFIED: 'success',
  DENIED: 'danger',
  WAITING: 'warning',
  'ON REVIEW': 'warning',
  CHANGED: 'blue',
  INCOMPLETE: 'neutral',
  'NO STATUS YET': 'neutral'
}

export type TeamStage = EventTeam['stage']

//! HARDCODED
export const mapStageTag: Record<
  string,
  | 'success'
  | 'warning'
  | 'danger'
  | 'lilac'
  | 'purple'
  | 'teal'
  | 'pink'
  | 'blue'
  | 'neutral'
> = {
  'pre-eliminary': 'danger',
  final: 'success',
  verification: 'warning'
}

export const possibleEventStatus: Array<TeamStage> = ['pre-eliminary', 'final']

export const RegisteredTeamList: React.FC<RegisteredTeamListProps> = ({
  teamData,
  pagination,
  eventId,
  currentSearchFilter,
  currentPage,
  itemsPerPage,
  filterStates,
  onPageChange,
  setCurrentPage,
  setSearchFilter,
  setTeamStageFilter,
  setTeamStatusFilter,
  onSearchClick
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    onPageChange(newPage)
  }

  // Unique attributes for filter
  const uniqueStatuses = Array.from(new Set<string>(possibleTeamStatus))
  const uniqueEventStatuss = Array.from(new Set(possibleEventStatus))

  const handleStatusFilterChange = (value: string) => {
    setTeamStatusFilter(
      value === 'default' ? undefined : (value as Exclude<TeamStatus, null>)
    )
    setCurrentPage(1)
  }

  const handleEventStatusFilterChange = (value: string) => {
    setTeamStageFilter(
      value === 'default' ? undefined : (value.toLowerCase() as TeamStage)
    )
    setCurrentPage(1)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value ?? '')
  }

  const searchClick = () => {
    setTimeout(() => {
      onSearchClick()
      setCurrentPage(1)
    }, 100)
  }

  return (
    // <div className="flex flex-col gap-6 space-y-6 px-4 py-16 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-6 space-y-6 px-0 py-16 sm:px-0 lg:px-8">
      <p className="font-dmsans text-6xl font-bold [text-shadow:0px_0px_17.7px_rgba(255,255,255,0.5)]">
        {eventId === 'oajbedpk' ? 'Team List' : 'Participant List'}
      </p>
      <div className="w-full space-y-6">
        {/* Search and Filters Section */}
        <div className="flex flex-col space-y-4 sm:gap-2 sm:space-y-0 md:flex-row md:items-center md:space-x-4 xl:gap-48">
          {/* Search Bar */}
          <div className="relative w-full flex-grow xl:w-[500px]">
            <Input
              type="text"
              placeholder={`Search by ${eventId === 'oajbedpk' ? 'team' : ''} name or ${eventId === 'oajbedpk' ? 'team' : ''} ID`}
              value={currentSearchFilter}
              onChange={handleSearchChange}
              onKeyDown={e => e.key === 'Enter' && searchClick()}
              className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#935ce0] sm:h-12"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#935ce0] hover:cursor-pointer"
              onClick={searchClick}
            />
          </div>

          {/* Filters */}
          {/* Filter on stages */}
          <div className="grid flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
            <Select
              defaultValue={
                filterStates.teamStageFilter
                  ? capitalizeFirstLetter(filterStates.teamStageFilter)
                  : 'default'
              }
              onValueChange={handleEventStatusFilterChange}>
              <SelectTrigger className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0] sm:h-12 xl:w-72">
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent className="bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0]">
                <SelectItem
                  value="default"
                  className="hover:bg-[#E0C2FF] focus:bg-[#E0C2FF] active:bg-[#D1A3FF]">
                  All Stages
                </SelectItem>
                {uniqueEventStatuss.map(stat => (
                  <SelectItem
                    className="hover:bg-[#E0C2FF] focus:bg-[#E0C2FF] active:bg-[#D1A3FF]"
                    key={capitalizeFirstLetter(stat)}
                    value={capitalizeFirstLetter(stat)}>
                    {capitalizeFirstLetter(stat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter on team status */}
            <Select
              defaultValue={filterStates.teamStatusFilter ?? 'default'}
              onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0] sm:h-12 xl:w-72">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0]">
                <SelectItem
                  value="default"
                  className="hover:bg-[#E0C2FF] focus:bg-[#E0C2FF] active:bg-[#D1A3FF]">
                  All Status
                </SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="hover:bg-[#E0C2FF] focus:bg-[#E0C2FF] active:bg-[#D1A3FF]">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead>{eventId === 'oajbedpk' && 'Team'} ID</TableHead>
                <TableHead>{eventId === 'oajbedpk' && 'Team'} Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamData.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>
                    {(pagination.currentPage - 1) * Number(itemsPerPage) + index + 1}
                  </TableCell>
                  <TableCell>{team.id}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    <Tag
                      text={getTeamStatus(team) || 'No Status Yet'}
                      variant={mapStatusTag[getTeamStatus(team) || 'NO STATUS YET']}
                      className="capitalize"
                    />
                  </TableCell>
                  <TableCell>
                    <Tag
                      text={capitalizeFirstLetter(team.stage)}
                      variant={mapStageTag[team.stage]}
                      className="capitalize"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/admin/event/${eventId}/team/${team.id}`}
                      className="flex w-full justify-center align-middle">
                      <Pencil className="h-auto w-5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {teamData.length === 0 && (
            <p className="mt-4 text-center font-dmsans text-[18px] text-white/80">
              No data found
            </p>
          )}
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalItems={pagination.totalItems}
            totalPages={pagination.totalPages}
            itemsPerPage={Number(itemsPerPage)}
            handlePageChange={handlePageChange}
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-x-2 text-center font-dmsans text-[16px]">
          <p>Page</p>
          <Select onValueChange={value => handlePageChange(Number(value))}>
            <SelectTrigger className="w-[80px] bg-purple-400">
              <SelectValue placeholder={currentPage} />
            </SelectTrigger>
            <SelectContent
              side="top"
              className="max-h-[240px] overflow-y-auto bg-purple-400 text-white">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <SelectItem
                  key={i + 1}
                  value={(i + 1).toString()}
                  className="font-dmsans text-[16px] focus:bg-black/50">
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>
            of <span className="text-white">{pagination.totalPages}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
