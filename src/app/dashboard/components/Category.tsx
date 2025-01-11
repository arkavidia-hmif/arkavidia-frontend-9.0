import React from 'react'

function Category({ categoryName }: { categoryName: string }) {
  return (
    <div className="rounded-[100px] bg-gradient-to-r from-[#25DE82] via-[#24A5B6] to-[#1E23C3] px-4 py-1.5 font-teachers text-[16px] font-bold">
      {categoryName ?? 'Category'}
    </div>
  )
}

export default Category
