import { useRef } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

interface ArrowSignProps {
  onClick: () => void
  direction: 'left' | 'right'
}
const handleGlowAnimation = (buttonRef: React.RefObject<HTMLButtonElement>) => {
  if (buttonRef.current) {
    // Add the glow effect

    buttonRef.current.style.scale = '1.5'
    // Remove the glow effect after 200 milliseconds
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.style.scale = '1'
      }
    }, 400)
  }
}
export const ArrowSign = ({ onClick, direction }: ArrowSignProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={buttonRef}
      onClick={() => {
        handleGlowAnimation(buttonRef)
        onClick()
      }}
      style={{
        position: 'absolute',
        zIndex: 10,
        fontSize: '2.25rem', // text-4xl
        color: 'rgba(255, 255, 255, 0.7)', // text-white text-opacity-70
        transition: 'transform 0.2s, opacity 0.2s, scale 0.3s',

        textShadow: '0 0 8px rgba(255, 255, 255, 0.8)' // Glow effect
      }}
      className={`${direction === 'left' ? 'left-0 lg:left-10' : 'right-0 lg:right-10'} flex h-full items-center rounded-md bg-transparent px-1.5 opacity-60 backdrop-blur-sm hover:opacity-100`}>
      <span>{direction === 'left' ? <FaAngleLeft /> : <FaAngleRight />}</span>
    </button>
  )
}
