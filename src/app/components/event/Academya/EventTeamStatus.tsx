import { useState } from "react"
import Dropdown, { MenuItem } from "../../Dropdown"
import { useToast } from "~/hooks/use-toast"
import useAxiosAuth from "~/lib/hooks/useAxiosAuth"
import { putAdminEventTeamStatus } from "~/api/generated"
import { cn } from "~/lib/utils"
import Tag from "../../Tag"
import { Check, Pencil, X } from "lucide-react"
import { Button } from "../../Button"

export function EventTeamStatus({
    stage,
    qualifications,
    stageWin,
    stageSuccess,
    stageFailed,
    teamID,
    eventID,
    qual
  }: {
    stage: 'Pre-eliminary' | 'Final'
    qualifications: MenuItem[]
    stageWin?: string[]
    stageSuccess?: string[]
    stageFailed?: string[]
    teamID: string
    eventID: string
    qual: string
  }) {
    const currentQualifications = qualifications.find(option => {
      return option.option === qual
    })
    const [initialQualification, setInitialQualification] = useState<MenuItem | null>(
      currentQualifications ?? null
    )
    const [hidden, setHidden] = useState<boolean>(false)
    const [qualification, setQualification] = useState<MenuItem | null>(
      currentQualifications ?? null
    )
    const { toast } = useToast()
    const authAxios = useAxiosAuth()
  
    const isWin = qualification?.option ? stageWin?.includes(qualification.option) : false
    const isSuccess = qualification?.option
      ? stageSuccess?.includes(qualification.option)
      : false
    const isFailed = qualification?.option
      ? stageFailed?.includes(qualification.option)
      : false
    const qualificationStatus = isWin
      ? 'lilac'
      : isSuccess
        ? 'success'
        : isFailed
          ? 'danger'
          : 'warning'
  
    const handleSaveQualification = async () => {
      if (stage === 'Final') {
        const resp = await putAdminEventTeamStatus({
          client: authAxios,
          body: {
            finalStatus: qualification?.option as
              | 'On Review'
              | 'Not Pass'
              | 'Juara 1'
              | 'Juara 2'
              | 'Juara 3'
              | undefined
          },
          path: {
            teamId: teamID,
            eventId: eventID
          }
        })
  
        if (resp.error) {
          // console.log('Failed to save Final Stage')
          toast({
            title: 'Failed to save Final Stage',
            description: 'Please try again later',
            variant: 'destructive'
          })
        } else {
          // console.log('Successfully saved Final Stage')
          toast({
            title: 'Successfully saved Final Stage',
            description: 'The final stage has been set to ' + qualification?.option,
            variant: 'success'
          })
          setInitialQualification(qualification)
          setQualification(qualification)
        }
  
        setHidden(false)
      } else {
        const resp = await putAdminEventTeamStatus({
          client: authAxios,
          body: {
            preeliminaryStatus: qualification?.option as
              | 'Pass'
              | 'Not Pass'
              | 'On Review'
              | undefined
          },
          path: {
            teamId: teamID,
            eventId: eventID
          }
        })
  
        if (resp.error) {
          // console.log('Failed to save Prelim Stage')
          toast({
            title: 'Failed to save Pre-eliminary Stage',
            description: 'Please try again later',
            variant: 'destructive'
          })
        } else {
          // console.log('Successfully saved Prelim Stage')
          toast({
            title: 'Successfully saved Pre-eliminary Stage',
            description: 'The pre-eliminary stage has been set to ' + qualification?.option,
            variant: 'success'
          })
          setInitialQualification(qualification)
          setQualification(qualification)
        }
  
        setHidden(false)
      }
      setHidden(false)
    }
  
    return (
      <div
        className={cn(
          'mt-5 flex items-center justify-between',
          hidden ? 'flex-col md:flex-row' : ''
        )}>
        <div>
          <h1 className="font-teachers text-[32px] font-bold">{stage}</h1>
        </div>
        {!hidden && (
          <div className="flex items-center gap-3">
            <Tag
              variant={qualificationStatus}
              text={qualification?.option ? qualification?.option : qual}
              className="w-fit px-6"
            />
            <Pencil
              size={25}
              className="text-white hover:cursor-pointer"
              strokeWidth={2.4}
              onClick={() => {
                setHidden(true)
              }}
            />
          </div>
        )}
        {hidden && (
          <div className="mt-3 flex items-center gap-2">
            <Dropdown
              data={qualifications}
              onChange={e => {
                setQualification(e)
              }}
              value={qualification}
            />
            <div className="flex flex-row gap-2 pb-2">
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                  setQualification(initialQualification)
                  setHidden(false)
                }}>
                <X size={10} className="text-white" strokeWidth={3} />
              </Button>
              <Button size={'sm'} onClick={handleSaveQualification}>
                <Check size={10} strokeWidth={3} />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }