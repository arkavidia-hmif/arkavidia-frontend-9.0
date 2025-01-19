import React from 'react'

function Tugas({ title, link, date }: { title?: string; link?: string; date?: string }) {
  return (
    <a href={link ? link : '/#'}>
      <div className="flex items-center justify-between rounded-xl border border-[#E66DD0] bg-white/10 px-3 py-2 leading-7 transition-all duration-100 hover:bg-gray-400/10 xl:py-3">
        <span className="font-teachers text-[14px] font-bold xl:text-base">
          {title ? title : 'Unknown Submission '}
        </span>
        <span className="hidden text-[14px] font-normal text-white/75 xl:block">
          {date ? date : 'Unknown Deadline'}{' '}
        </span>
      </div>
    </a>
  )
}

export default Tugas
