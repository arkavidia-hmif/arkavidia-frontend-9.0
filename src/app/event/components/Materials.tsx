'use client'
import React, { useState } from 'react'
import { Button } from '~/app/components/Button'
import FrameAccordion from '~/app/components/FrameAccordion'

interface MaterialFile {
  id: number;
  name: string;
  url: string;
}

interface MaterialCategory {
  id: number;
  title: string;
  description: string;
  files: MaterialFile[];
}

const materialsData: MaterialCategory[] = [
  {
    id: 1,
    title: 'PLACEHOLDER Buku Besar Materi dan Metode XXXXXXXX',
    description:
      '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."',
    files: [
      { id: 1, name: 'Materi XXXX.pdf', url: '/path/to/MateriXXXX.pdf' },
    ],
  },
  {
    id: 2,
    title: 'PLACEHOLDER Introduction to Software Engineering',
    description: '',
    files: [],
  },
  {
    id: 3,
    title: 'PLACEHOLDER Object-Oriented Programming',
    description: '',
    files: [],
  },
];

function Materials({data = materialsData} : {data?: MaterialCategory[]}) {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleExpandedId = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="flex flex-col mx-auto max-w-5xl">
      {materialsData.map((category) => (
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
                category.files.map((file) => (
                    <div key={file.id} className="flex flex-col gap-3">
                        <div className='h-15 max-w-max border-[#E8C1FC] border-[0.9px] p-3 rounded-lg flex items-center'>
                            <div className="flex items-center gap-2">
                            <img src="/icons/fileinputassets/PDF.svg" alt="PDF" className="w-7 h-7" />
                            <p className='text-sm'>{file.name}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                asChild
                                variant="default"
                                size="lg"
                                className="w-[170px] h-[40px] rounded-2xl flex justify-evenly"
                                >
                                <a href={file.url} download>
                                    <img src="/icons/fileinputassets/download.svg" alt="Download" className="w-6 h-6"/>
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

export default Materials