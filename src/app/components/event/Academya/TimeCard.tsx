interface TimeCardProps {
  digit: string
}

export function TimeCard({ digit }: TimeCardProps) {
  return (
    <div
      className="relative flex h-16 w-12 items-center justify-center rounded-2xl md:h-[80px] md:w-16 lg:h-24"
      style={{ background: 'linear-gradient(180deg, #A555CC 0%, #7138C0 100%)' }}>
      <span
        className="font-belanosima text-[30px] font-bold text-white md:text-[36px] lg:text-5xl"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}>
        {digit}
      </span>
    </div>
  )
}
