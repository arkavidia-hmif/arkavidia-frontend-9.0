import Image, { StaticImageData } from 'next/image'
import StandingPod from '/public/images/competition/standing-pod.png'
interface StandingPreviewProps {
  preview: string
  isActive?: boolean
}

export const StandingPreview = ({ preview, isActive = false }: StandingPreviewProps) => {
  const PreviewWidth = isActive ? 500 : 400
  const PreviewHeight = isActive ? 350 : 300

  const StandingTranslateY = isActive ? 'translate-y-[-150px]' : 'translate-y-[-120px]'

  const StandingWidth = isActive ? 'w-[200px]' : 'w-[140px]'
  const MarginTop = isActive ? '' : 'translate-y-[100px]'
  return (
    <div
      className={`relative flex w-full select-none flex-col items-center justify-center ${MarginTop}`}>
      <Image
        src={preview}
        alt="Competiton Preview"
        width={PreviewWidth}
        height={PreviewHeight}
        className={`z-10 w-[${PreviewWidth}] max-w-none`}
        style={{ width: PreviewWidth }}
        quality={100}
      />
      <Image
        src={StandingPod}
        alt="Standing Pod"
        className={`${StandingTranslateY} ml-[10px] ${StandingWidth} object-scale-down`}
        quality={100}
      />
    </div>
  )
}
