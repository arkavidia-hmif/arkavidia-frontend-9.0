import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './../Table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './../Pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select"

type TeamDataItem = {
  teamId: string;
  teamName: string;
  teamStatus: string;
  teamCompetitionStat: string;
};

type RegisteredTeamListProps = {
  teamData: TeamDataItem[];
};

export const RegisteredTeamList: React.FC<RegisteredTeamListProps> = ({ teamData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [competitionStatFilter, setCompetitionStatFilter] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return teamData.filter(team => 
      (!statusFilter || team.teamStatus === statusFilter) &&
      (!competitionStatFilter || team.teamCompetitionStat === competitionStatFilter)
    );
  }, [teamData, statusFilter, competitionStatFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueStatuses = Array.from(new Set(teamData.map(team => team.teamStatus)));
  const uniqueCompetitionStats = Array.from(new Set(teamData.map(team => team.teamCompetitionStat)));

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Select onValueChange={(value) => setStatusFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {uniqueStatuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setCompetitionStatFilter(value || null)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stages</SelectItem>
            {uniqueCompetitionStats.map(stat => (
              <SelectItem key={stat} value={stat}>{stat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>List of Registered Teams</TableCaption>
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
          {paginatedData.map((team, index) => (
            <TableRow key={team.teamId}>
              <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell className="font-medium">{team.teamId}</TableCell>
              <TableCell>{team.teamName}</TableCell>
              <TableCell>{team.teamStatus}</TableCell>
              <TableCell>{team.teamCompetitionStat}</TableCell>
              <TableCell>
                {/* Add action buttons here */}
                View
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

