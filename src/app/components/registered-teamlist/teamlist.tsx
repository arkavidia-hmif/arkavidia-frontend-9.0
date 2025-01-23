'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../Table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from './../Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './../ui/select'
import Tag from './../Tag'
import { Input } from './../ui/input'
import { Search, Pencil } from 'lucide-react'
import { Team } from '~/api/generated'

interface Pagination {
  currentPage: number
  totalItems: number
  totalPages: number
  next: string | null
  prev: string | null
}

interface RegisteredTeamListProps {
  teamData: Team[]
  pagination: Pagination
  onPageChange: (newPage: number) => void // Callback for handling page changes
}

const maximumItemPage = 10

const getPaginationRange = (current: number, total: number, delta = 2) => {
  const range: (number | string)[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  range.push(1)

  if (left > 2) range.push('...')
  for (let i = left; i <= right; i++) range.push(i)
  if (right < total - 1) range.push('...')
  if (total > 1) range.push(total)

  return range
}

export const RegisteredTeamList: React.FC<RegisteredTeamListProps> = ({
  teamData,
  pagination,
  onPageChange
}) => {
  const [currentPage, setCurrentPage] = useState(pagination.currentPage)
  const [itemsPerPage] = useState(maximumItemPage)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [CompetitionStatusFilter, setCompetitionStatusFilter] = useState<string | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return
    setCurrentPage(newPage)
    onPageChange(newPage)

    // Reset filters when pagination changes
    setStatusFilter(null)
    setCompetitionStatusFilter(null)
    setSearchTerm('')
  }

  // Apply filter
  const filteredData = useMemo(() => {
    return teamData.filter(team => {
      // Check if statusFilter is not set or matches the verification status
      const matchesStatus =
        !statusFilter || team.document?.[0].isVerified === (statusFilter === 'Verified')

      // Check if CompetitionStatusFilter is not set or matches the verification status
      const matchesCompetitionStatus = !CompetitionStatusFilter
      // TODO: add field untuk menampilkan stage tim

      // Check if the team name or team ID contains the search term (case-insensitive)
      const matchesSearchTerm =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.id.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesCompetitionStatus && matchesSearchTerm
    })
  }, [teamData, statusFilter, CompetitionStatusFilter, searchTerm])

  // Total data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Set up the page in pagination
  useEffect(() => {
    setCurrentPage(prevPage => Math.min(prevPage, totalPages || 1))
  }, [totalPages])

  // Function to get team status
  const getTeamStatus = (team: Team) => {}

  // Unique attributes for filter
  const stageSet = new Set<string>()
  const statusesSet = new Set<string>()

  teamData.forEach(team => {
    if (team.stage) {
      stageSet.add(team.stage)
    }

    if (!team.document?.[0]) {
      statusesSet.add('Payment Not Submitted')
    } else if (team.document?.[0].isVerified) {
      statusesSet.add('Verified')
    } else {
      statusesSet.add('Not verified')
    }
  })

  teamData.map(team => {
    if (!team.document?.[0]) {
      return 'Payment Not Submitted'
    } else if (team.document?.[0].isVerified) {
      return 'Verified'
    } else {
      return 'Not Verified'
    }
  })

  const uniqueStatuses = Array.from(statusesSet)
  const uniqueCompetitionStatuss = Array.from(new Set(['Pre-eliminary', 'Final']))

  // Map status to their tag color
  const mapStatusTag: Record<
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
    Verified: 'success',
    Waiting: 'warning',
    Denied: 'danger'
  }

  const mapStageTag: Record<
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
    'Pre-eliminary': 'danger',
    Final: 'success'
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'default' ? null : value)
    setCurrentPage(1)
  }

  const handleCompetitionStatusFilterChange = (value: string) => {
    setCompetitionStatusFilter(value === 'default' ? null : value)
    setCurrentPage(1)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-6 space-y-6 px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-dmsans text-6xl font-bold [text-shadow:0px_0px_17.7px_rgba(255,255,255,0.5)]">
        Team List
      </p>
      <div className="w-full space-y-6">
        {/* Search and Filters Section */}
        <div className="flex flex-col space-y-4 sm:gap-2 sm:space-y-0 md:flex-row md:items-center md:space-x-4 xl:gap-48">
          {/* Search Bar */}
          <div className="relative w-full flex-grow xl:w-[500px]">
            <Input
              type="text"
              placeholder="Search by team name or team ID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#935ce0] sm:h-12"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#935ce0]" />
          </div>

          {/* Filters */}
          {/* Filter on stages */}
          <div className="grid flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4">
            <Select onValueChange={handleCompetitionStatusFilterChange}>
              <SelectTrigger className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0] sm:h-12 xl:w-72">
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent className="bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0]">
                <SelectItem
                  value="default"
                  className="hover:bg-[#E0C2FF] focus:bg-[#E0C2FF] active:bg-[#D1A3FF]">
                  All Stages
                </SelectItem>
                {uniqueCompetitionStatuss.map(stat => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter on team status */}
            <Select onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="h-10 w-full border-[1.5px] border-[#7138C0] bg-[#F5E1FF] font-dmsans font-medium text-[#7138C0] sm:h-12 xl:w-72">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">All Statuses</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
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
                <TableHead>Team ID</TableHead>
                <TableHead>Team Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{team.id}</TableCell>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>
                      <Tag
                        text={team.document?.[0].isVerified ? 'Verified' : 'Not Verified'}
                        variant={
                          mapStatusTag[
                            team.document?.[0].isVerified ? 'Verified' : 'Not Verified'
                          ]
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Tag
                        text={team.document?.[0].isVerified ? 'Verified' : 'Not Verified'}
                        variant={
                          mapStatusTag[
                            team.document?.[0].isVerified ? 'Verified' : 'Not Verified'
                          ]
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <a className="flex w-full justify-center align-middle" href="#">
                        <Pencil className="h-auto w-5" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent className="flex-wrap">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}
                />
              </PaginationItem>

              {/* Pagination Numbers */}
              {getPaginationRange(currentPage, pagination.totalPages).map(
                (item, index) => (
                  <PaginationItem key={index}>
                    {typeof item === 'number' ? (
                      <PaginationLink
                        onClick={() => handlePageChange(item)}
                        isActive={currentPage === item}>
                        {item}
                      </PaginationLink>
                    ) : (
                      <span className="px-2 text-gray-500">{item}</span>
                    )}
                  </PaginationItem>
                )
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === pagination.totalPages}
                  className={
                    currentPage === pagination.totalPages
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
