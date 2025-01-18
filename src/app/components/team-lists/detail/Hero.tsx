import Tag from '../../Tag'

interface ProfileHeroProps {
  teamName: string
  teamID: string
  teamStatus: 'Verified' | 'Unverified'
  teamStage: string
}

function Hero({
  teamName,
  teamID,
  teamStatus,
  teamStage
}: ProfileHeroProps) {
  return (
    <div className="flex w-full flex-col rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:flex-row md:justify-between md:p-10">
        <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-2xl font-bold text-white md:text-4xl">{teamName}</h1>
            <h3 className="text-sm text-white opacity-80 md:text-xl">{teamID}</h3>
        </div>

        <div className='flex flex-col gap-4'>
            <div className='flex gap-4 justify-between'>
                <div className='flex items-center'>
                    <h1 className='font-teachers font-bold text-xl'>Team Status</h1>
                </div>
                <div className='mx-auto'>
                    <Tag variant={teamStatus === 'Verified' ? 'success' : 'warning'} text={teamStatus} className='w-[100px]' />
                </div>
            </div>
            <div className='flex gap-4 justify-between'>
                <div className='flex items-center'>
                    <h1 className='font-teachers font-bold text-xl'>Team Stage</h1>
                </div>
                <div>
                    <Tag variant="danger" text={teamStage} className='w-[100px]'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero
