import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/app/components/Pagination'
import { getPaginationRange } from './pagination-utils'

interface PaginationComponentProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  handlePageChange: (page: number) => void
}

function PaginationComponent(props: PaginationComponentProps) {
  const { currentPage, totalPages, handlePageChange } = props
  return (
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
        {getPaginationRange(currentPage, totalPages).map((item, index) => (
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
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent
