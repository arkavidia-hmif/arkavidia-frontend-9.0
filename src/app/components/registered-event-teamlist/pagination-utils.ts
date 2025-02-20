const getPaginationRange = (current: number, total: number) => {
  const pagination: (number | string)[] = []
  const sibling = 1

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // Always include first page
  pagination.push(1)

  // Calculate range of pages around current page
  const leftBound = Math.max(2, current - sibling)
  const rightBound = Math.min(total - 1, current + sibling)

  // Add left ellipsis if needed
  if (leftBound > 2) {
    pagination.push('...')
  }

  // Add range of middle pages
  pagination.push(...range(leftBound, rightBound))

  // Add right ellipsis if needed
  if (rightBound < total - 1) {
    pagination.push('...')
  }

  // Always include last page
  if (total > 1) {
    pagination.push(total)
  }

  return pagination
}

export { getPaginationRange }
