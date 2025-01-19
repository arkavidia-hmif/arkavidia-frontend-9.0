'use client';

import { CreateTeamPopup } from "./join-competition/create-team";
import { JoinCompetitionPopup } from "./join-competition/join-competition";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogTrigger
} from './ui/dialog';
import { useState, useEffect } from "react";
import { Button } from "~/app/components/Button";
import { ArrowLeft, ArrowRight, UserPlus, UserSearch } from "lucide-react";
import useAxiosAuth from "~/lib/hooks/useAxiosAuth";
import { getCompetitionNameById } from "~/api/generated";
import { useRouter } from "next/navigation";

export type CompetitionType = 'CP' | 'CTF' | 'Hackvidia' | 'UXvidia' | 'Datavidia' | 'Arkalogica' | 'Default'

export const competitionAbbr: Record<CompetitionType, string> = {
    CP: 'Competitive Programming',
    CTF: 'Capture The Flag',
    Hackvidia: 'Hackvidia',
    UXvidia: 'UXvidia',
    Datavidia: 'Datavidia',
    Arkalogica: 'Arkalogica',
    Default: 'Competition Name'
  }

export default function CompetitionRegistration({ competitionID }: { competitionID: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [competitionType, setCompetitionType] = useState<CompetitionType>('Default');
    
    
    useEffect(() => {
        const fetchCommpetitionName = async () => {
          const response = await getCompetitionNameById({
            client: axiosAuth,
            path: {
              competitionId: competitionID
            }
          })
    
          if (response.error || !response.data.title) {
            // console.log(response);
            router.push('/404');
            return;
          }
    
          setCompetitionType(response.data.title as CompetitionType);
        }
    
        fetchCommpetitionName();
      },[])
    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" onClick={() => setIsOpen(true)} className="flex gap-[3rem] justify-center w-[200px]">
            <div>
                <p>
                    Register Now
                </p>
            </div>
            <ArrowRight strokeWidth={3}/>
          </Button>
        </DialogTrigger>
        <DialogContent className="flex max-w-5xl px-[3rem] items-center md:justify-center gap-4 bg-[url('/images/join-competition/bg.png')] bg-cover bg-center bg-no-repeat py-[3rem] font-teachers">
          <div className="flex w-full flex-col justify-center md:gap-4">
            <div className="grow-0">
              <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <ArrowLeft className="h-auto w-5 md:w-8" />
              </DialogClose>
            </div>
            <div className="grow-1 flex flex-col md:gap-12">
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle className="text-2xl md:text-5xl font-bold">
                    Competition Name Registration
                    </DialogTitle>
                    <DialogDescription className="text-base md:text-xl">
                    Build your team or join forces with others
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-around">
                    <div className="flex flex-col gap-4 items-center">
                        <UserPlus strokeWidth={2.5} size={120}/>
                        <CreateTeamPopup competitionID={competitionID} competitionType={competitionType} />
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        <UserSearch strokeWidth={2.5} size={120}/>
                        <JoinCompetitionPopup competitionID={competitionID} competitionType={competitionType} />
                    </div>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
}   
