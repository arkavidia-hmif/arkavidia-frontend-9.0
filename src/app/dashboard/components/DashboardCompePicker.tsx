'use client'
import React, { useEffect, useState } from 'react'
import { getTeams } from '~/api/generated'
import Dropdown, { MenuItem } from '~/app/components/Dropdown'
import { useToast } from '~/hooks/use-toast'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { expandCompetitionName } from '~/lib/utils'
import { ExtendedMenuItem } from '../page'

interface DashboardCompePickerProps {
  onChange: (competition: ExtendedMenuItem) => void
  options: ExtendedMenuItem[]
}

function DashboardCompePicker(props: DashboardCompePickerProps) {
  const [competitionList, setCompetitionList] = useState<Array<ExtendedMenuItem>>(
    props.options
  )
  const [currentCompetition, setCurrentCompetition] = useState<ExtendedMenuItem>(
    props.options[0] ?? { id: 0, competitionId: 'null', option: 'No competition joined' }
  )

  const handleChange = (selectedItem: MenuItem | null) => {
    if (!selectedItem) return
    const selectedCompetition = competitionList.find(
      competition => competition.id === selectedItem.id
    )
    if (selectedCompetition) {
      setCurrentCompetition(selectedCompetition)
      props.onChange(selectedCompetition)
    }
  }

  return (
    <Dropdown
      data={
        competitionList.length > 0
          ? competitionList
          : [{ id: 0, option: 'No competition joined' }]
      }
      label=""
      onChange={handleChange}
      value={currentCompetition}
      className="!max-w-[250px] grow-0"
    />
  )
}

export default DashboardCompePicker
