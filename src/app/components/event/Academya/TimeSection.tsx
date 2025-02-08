import { TimeCard } from './TimeCard'

interface TimeSectionProps {
  value: string
  label: string
}

export function TimeSection({ value, label }: TimeSectionProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-4">
        <TimeCard digit={value[0]} />
        <TimeCard digit={value[1]} />
      </div>
      <span className="font-teachers text-[18px] font-bold text-white">{label}</span>
    </div>
  )
}
