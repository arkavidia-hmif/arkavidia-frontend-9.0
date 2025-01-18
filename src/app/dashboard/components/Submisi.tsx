import React from 'react'
import ComponentBox from './ComponentBox'
import Tugas from './Tugas'

interface SubmissionItem {
  title: string
  date: Date
}

function Submisi({ submissions }: { submissions?: SubmissionItem[] }) {
  return (
    <ComponentBox title="Submisi" center={false}>
      {submissions?.length === 0 ? (
        <div className="mb-2 mt-2 text-white/60">Belum ada Submisi</div>
      ) : (
        <div className="flex w-[100%] flex-col gap-3">
          {submissions.map((submisi, index) => {
            const formattedDate = `${submisi.date.getDate().toString().padStart(2, '0')}/${(submisi.date.getMonth() + 1).toString().padStart(2, '0')}/${submisi.date.getFullYear()}, ${submisi.date.getHours().toString().padStart(2, '0')}:${submisi.date.getMinutes().toString().padStart(2, '0')} WIB`
            return <Tugas key={index} title={submisi.title} date={formattedDate} />
          })}
        </div>
      )}
    </ComponentBox>
  )
}

export default Submisi
