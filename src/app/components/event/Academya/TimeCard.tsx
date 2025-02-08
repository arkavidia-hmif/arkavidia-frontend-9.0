interface TimeCardProps {
  digit: string
}

export function TimeCard({ digit }: TimeCardProps) {
  return (
    <div
      className="relative flex h-24 w-16 items-center justify-center rounded-2xl"
      style={{ background: 'linear-gradient(180deg, #A555CC 0%, #7138C0 100%)' }}>
      <span
        className="font-belanosima text-5xl font-bold text-white"
        style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.7)' }}>
        {digit}
      </span>
    </div>
  )
}
