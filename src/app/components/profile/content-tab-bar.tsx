'use client'
import { Dispatch, SetStateAction } from 'react'
import { contentType, Menu } from './menu'

interface Props {
  selected: contentType
  setSelected: Dispatch<SetStateAction<contentType>>
}

export const ContentTabBar = ({ selected, setSelected }: Props) => {
  return (
    <div className="relative h-fit">
      <div className="relative z-10 flex w-full flex-row justify-evenly h-fit">
        <Menu
          Selected={selected}
          setSelected={setSelected}
          title={'Profile Information'}
        />
        <Menu Selected={selected} setSelected={setSelected} title={'Social Media'} />
      </div>
      <span className="absolute bottom-0 h-1 w-full rounded-full bg-white"></span>
    </div>
  )
}
