import React from 'react'

function Tugas({ title, link, date }: { title?: string; link?: string; date?: string }) {
  return (
    <a href={link ? link : '/#'}>
      <div className="flex justify-between items-center rounded-xl border border-[#E66DD0] bg-white/10 px-3 py-2 xl:py-3 leading-7 backdrop-blur-sm transition-all duration-100 hover:bg-gray-400/10">
        <span className="font-teachers text-[14px] font-bold xl:text-base">
          {title ? title : 'Unknown Submission '}
        </span>
        <span className='hidden xl:block text-[14px] font-normal text-white/75 '>{date ? date : 'Unknown Deadline'} </span>
      </div>
    </a>
  )
}

export default Tugas
