import React from 'react'

function Category({ categoryName }: { categoryName: string }) {
  return (
    <div
      className="relative rounded-full px-[20px] py-1 font-teachers text-[14px] font-bold text-white"
      style={{
        background:
          'linear-gradient(to right, rgba(73, 152, 127, 1), rgba(64, 131, 144, 1), rgba(43, 83, 146, 1))'
      }}>
      {categoryName ?? 'Category'}
    </div>
  )
}

export default Category
