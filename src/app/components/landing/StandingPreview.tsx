import Image, { StaticImageData } from 'next/image'

interface StandingPreviewProps {
  preview: string
  isActive?: boolean
}

export const StandingPreview = ({ preview, isActive = false }: StandingPreviewProps) => {
  const PreviewWidth = isActive ? 500 : 400
  const PreviewHeight = isActive ? 350 : 300

  const StandingTranslateY = isActive ? 'translate-y-[-150px]' : 'translate-y-[-120px]'

  const StandingWidth = isActive ? 200 : 160
  const StandingHeight = isActive ? 100 : 200
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <Image
        src={preview}
        alt="Competiton Preview"
        width={PreviewWidth}
        height={PreviewHeight}
        className={`z-10 w-[${PreviewWidth}] max-w-none`}
        style={{ width: PreviewWidth }}
      />
      <Image
        src={'/images/competition/standing-pod.png'}
        alt="Standing Pod"
        width={StandingWidth}
        height={StandingHeight}
        className={`${StandingTranslateY} ml-[10px] w-[${StandingWidth}] object-scale-down`}
      />
    </div>
  )
}
