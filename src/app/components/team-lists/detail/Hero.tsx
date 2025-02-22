import { mapStageTag, mapStatusTag, TeamStatus } from '../../registered-teamlist/teamlist'
import Tag from '../../Tag'

interface ProfileHeroProps {
  teamName: string
  teamID: string
  teamStatus: TeamStatus
  teamStage: string
  isNotTeam?: boolean
}

function Hero({ teamName, teamID, teamStatus, teamStage, isNotTeam }: ProfileHeroProps) {
  return (
    <div className="flex w-full flex-col rounded-lg border-[1px] border-white border-opacity-50 bg-gradient-to-r from-[rgba(255,255,255,0.24)] to-[rgba(255,255,255,0.08)] p-6 shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] backdrop-blur-[10px] md:flex-row md:justify-between md:p-10">
      <div className="flex flex-col gap-1 md:gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-4xl">{isNotTeam ? '' : 'Team'} Name: </h1>
          <h1 className="text-2xl font-bold text-white md:text-4xl">{teamName}</h1>
        </div>
        <h3 className="text-sm text-white opacity-80 md:text-xl">{teamID}</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 lg:gap-8">
          <div className="flex items-center">
            <h1 className="font-teachers text-xl font-bold">
              {isNotTeam ? '' : 'Team'} Status
            </h1>
          </div>
          <div className="">
            <Tag
              variant={mapStatusTag[teamStatus ? teamStatus : 'NO STATUS YET']}
              text={teamStatus ? teamStatus : 'No Status Yet'}
              className="w-[100px] text-center capitalize lg:w-[240px] lg:text-left"
            />
          </div>
        </div>
        <div className="flex justify-between gap-4 lg:gap-8">
          <div className="flex items-center">
            <h1 className="font-teachers text-xl font-bold">
              {isNotTeam ? '' : 'Team'} Stage
            </h1>
          </div>
          <div>
            <Tag
              variant={mapStageTag[teamStage]}
              text={teamStage}
              className="w-[100px] text-center capitalize lg:w-[240px] lg:text-left"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
