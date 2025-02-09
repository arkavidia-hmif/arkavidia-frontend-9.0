'use client'
import React, { useState } from 'react'
import { Button } from '~/app/components/Button'
import FrameAccordion from '~/app/components/FrameAccordion'

interface MaterialFile {
  id: number
  name: string
  url: string
}

interface MaterialCategory {
  id: number
  title: string
  description: string
  files: MaterialFile[]
}

const materialsData: MaterialCategory[] = [
  {
    id: 1,
    title: 'PLACEHOLDER Buku Besar Materi dan Metode XXXXXXXX',
    description:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."',
    files: [{ id: 1, name: 'Materi XXXX.pdf', url: '/path/to/MateriXXXX.pdf' }]
  },
  {
    id: 2,
    title: 'PLACEHOLDER Introduction to Software Engineering',
    description: '',
    files: []
  },
  {
    id: 3,
    title: 'PLACEHOLDER Object-Oriented Programming',
    description: '',
    files: []
  }
]

function EventMaterials({ data = materialsData }: { data?: MaterialCategory[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpandedId = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col">
      {materialsData.map(category => (
        <FrameAccordion
          key={category.id}
          title={category.title}
          color="#4D06B0CC"
          radius="12px"
          isExpanded={expandedId === category.id}
          onToggle={() => toggleExpandedId(category.id)}
          content={
            <div className="text-white">
              <p className="mb-4">{category.description}</p>
              {category.files.length > 0 ? (
                category.files.map(file => (
                  <div key={file.id} className="flex flex-col gap-3">
                    <div className="h-15 flex max-w-max items-center rounded-lg border-[0.9px] border-[#E8C1FC] p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src="/icons/fileinputassets/PDF.svg"
                          alt="PDF"
                          className="h-7 w-7"
                        />
                        <p className="text-sm">{file.name}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="flex h-[40px] w-[170px] justify-evenly rounded-2xl">
                        <a href={file.url} download>
                          <img
                            src="/icons/fileinputassets/download.svg"
                            alt="Download"
                            className="h-6 w-6"
                          />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No materials available.</p>
              )}
            </div>
          }
        />
      ))}
    </div>
  )
}

export default EventMaterials
