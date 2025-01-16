import React from 'react'

function Tugas({ title, link }: { title?: string; link?: string }) {
  return (
    <a href={link ? link : '/#'}>
      <div className="rounded-xl border border-[#E66DD0] bg-white/10 px-3 py-2 leading-7 backdrop-blur-sm transition-all duration-100 hover:bg-gray-400/10">
        {title ? title : 'Unknown Submission '}
      </div>
    </a>
  )
}

export default Tugas
