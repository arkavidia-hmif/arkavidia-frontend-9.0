import { Dispatch, SetStateAction } from 'react'
import { Button } from '../ui/button'

export type contentType = 'Profile Information' | 'Social Media'

interface Props {
  Selected: contentType
  setSelected: Dispatch<SetStateAction<contentType>>
  title: contentType
}

export const Menu = (props: Props) => {
  const isSelected = props.Selected == props.title

  // Set the current menu into active state
  function onClick() {
    props.setSelected(props.title)
  }

  return (
    <Button
      variant={'ghost'}
      className="flex h-full w-full flex-col px-0 py-0 text-white hover:bg-white/40 hover:text-white"
      onClick={onClick}>
      <h1 className="font-teachers text-xl font-bold md:text-2xl">{props.title}</h1>
      {isSelected ? (
        <span className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#FF95B8] via-[#A555CC] to-[#48E6FF]"></span>
      ) : (
        <span className="h-1.5 w-full"></span>
      )}
    </Button>
  )
}
