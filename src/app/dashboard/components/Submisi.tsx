import React from 'react'
import ComponentBox from './ComponentBox'
import Tugas from './Tugas'

interface SubmissionItem {
  title: string
}

function Submisi({ submissions }: { submissions?: SubmissionItem[] }) {
  return (
    <ComponentBox title="Submisi" center={false}>
      {!submissions?.length ? (
        <div className="mb-2 mt-2 text-white/60">Belum ada Submisi</div>
      ) : (
        <div className="flex w-[100%] flex-col gap-3">
          {submissions.map((submisi, index) => (
            <Tugas key={index} title={submisi.title} />
          ))}
        </div>
      )}
    </ComponentBox>
  )
}

export default Submisi
