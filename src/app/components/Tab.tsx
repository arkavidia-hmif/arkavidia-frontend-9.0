'use client'

import { useState, Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button'

export type contentType = string 

interface TabProps {
  contentType: contentType[] // Array of tab titles
  content: React.ReactNode[] // Corresponding content for each tab
}

// Tab Component
export const Tab = ({ contentType, content }: TabProps) => {
  const [selected, setSelected] = useState<contentType>(contentType[0]) 

  const selectedContent = content[contentType.indexOf(selected)] 

  return (
    <>
      {/* Tab Bar */}
      <div className="relative h-fit">
        <div className="relative z-10 flex w-full flex-row justify-between gap-12 h-fit">
          {contentType.map((title) => (
            <Menu
              key={title}
              Selected={selected}
              setSelected={setSelected}
              title={title}
            />
          ))}
        </div>
        <span className="absolute bottom-0 h-1 w-full rounded-full bg-white"></span>
      </div>
      {/* Render Selected Content */}
      <div className="mt-2">{selectedContent}</div>
    </>
  )
}

// Menu Component
interface MenuProps {
  Selected: contentType
  setSelected: Dispatch<SetStateAction<contentType>>
  title: contentType
}

const Menu = ({ Selected, setSelected, title }: MenuProps) => {
  const isSelected = Selected === title

  const onClick = () => {
    setSelected(title)
  }

  return (
    <Button
      variant="ghost"
      className="text-white h-full px-0 w-full flex-col flex py-0 hover:bg-white/40 hover:text-white"
      onClick={onClick}
    >
      <h1 className="font-bold font-teachers md:text-2xl text-xl">{title}</h1>
      {isSelected ? (
        <span className="h-1.5 w-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF] rounded-full"></span>
      ) : (
        <span className="h-1.5 w-full"></span>
      )}
    </Button>
  )
}
