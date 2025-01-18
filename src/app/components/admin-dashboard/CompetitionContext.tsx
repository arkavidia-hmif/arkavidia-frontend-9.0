import React from 'react'
import Dropdown, { MenuItem } from '../Dropdown'
import FrameInfo from './FrameInfo'
import FrameSubmissions from './FrameSubmissions'

const CompetitionContext = () => {
  const Unverified = 999
  const Registered = 999

  const DROPDOWN_DATA: MenuItem[] = [
    { id: 1, option: 'Arkavidia' },
    { id: 2, option: 'ArkavX' },
    { id: 3, option: 'UXVidia' },
    { id: 4, option: 'Datavidia' },
    { id: 5, option: 'Capture The Flag' },
    { id: 6, option: 'Hackvidia' },
    { id: 7, option: 'Academya' }
  ]

  const [selectedCompetition, setSelectedCompetition] = React.useState<MenuItem | null>(
    DROPDOWN_DATA[0]
  )

  return (
    <>
      {/* Competition */}
      <div className="my-8 flex flex-row items-center justify-between gap-10">
        <h1 className="font-belanosima text-5xl">Competition</h1>
        <div>
          <Dropdown
            data={DROPDOWN_DATA}
            label={''}
            value={selectedCompetition}
            onChange={setSelectedCompetition}
          />
        </div>
      </div>

      {/* Competition Participants */}
      <div className="my-8 flex items-center justify-between gap-10">
        <FrameInfo
          number={Unverified}
          helperText={'Registered Participants'}
          imgSrc={'/images/admin-dashboard/supervisor-acc.svg'}
        />
        <FrameInfo
          number={Registered}
          helperText={'Unverified Participants'}
          imgSrc={'/images/admin-dashboard/unverified-acc.svg'}
        />
      </div>

      {/* Submissions  */}
      <FrameSubmissions />
    </>
  )
}

export default CompetitionContext
