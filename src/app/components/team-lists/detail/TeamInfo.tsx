import { Check, ExternalLink, Pencil, SendHorizonal, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Media, TeamMember } from "~/api/generated";
import { Button } from "~/app/components/Button";
import Tag from "~/app/components/Tag";
import { cn } from "~/lib/utils";
import { Input } from "../../Input";
import Dropdown, { MenuItem } from "../../Dropdown";

const DEFAULT_FIELD = "has not been filled";

type GetTeamDetailResponse = {
    members?: Array<TeamMember> | undefined; // Make members optional
    existsSubmission?: boolean; 
};

function Field({title, value}: {title: string, value: string}) {
    return (
        <div>
            <div>
                <h1 className="font-semibold">{title}</h1>
            </div>
            <div>
                <p className="text-purple-100">{value}</p>
            </div>
        </div>
    )
}

function PaymentProof() {
    return (
        <div className="mb-6">
                <div className="border border-white rounded-lg py-3 px-6 ">
                    <FileRequirements filetype="Payment Proof" url="#" editable={true} isPaymentProof/>
                </div>
        </div>
    )
}

function FileRequirements({filetype, url, editable, isPaymentProof}: {filetype: string, url: string, editable?: boolean, isPaymentProof?: boolean}) {
    const [isFeedback, setIsFeedback] = useState(false);

    return (
        <div className={cn("flex justify-between", isFeedback ? 'md:flex-row gap-2 flex-col' : '')}>
            <div className={cn("flex items-center", isPaymentProof ? 'gap-4' : 'gap-1')} >
                <ExternalLink size={24} />
                <div className="mt-1">
                    <Link href={url}>
                        <p className={cn("hover:underline hover:cursor-pointer", isPaymentProof ? 'text-lg font-semibold' : '')}>{filetype}</p>
                    </Link>
                </div>
            </div>
            {
                editable ? 
                    <>
                        <div className={cn("gap-5", isFeedback ? 'hidden' : 'flex')}>
                            <Button variant={'outline'} size={'sm'} onClick={() => setIsFeedback(true)}>
                                <X size={10} className="text-white" strokeWidth={3} />
                            </Button>
                            <Button size={'sm'}>
                                <Check size={10}  strokeWidth={3}/>
                            </Button>
                        </div>
                        <div className={cn("gap-5 items-center justify-start", isFeedback ? 'flex' : 'hidden')}>
                                <Input placeholder="Send what's wrong" className="max-w-[250px]" />
                                <Button size={'sm'} onClick={() => setIsFeedback(false)}>
                                    <SendHorizonal size={15}  strokeWidth={3}/>
                                </Button>
                        </div> 
                    </>
                    : 
                    <div>
                        <Check size={30}  strokeWidth={2}/>
                    </div>
            }
            
        </div>
    )
}

function MemberCard(
    {
        isTeamLeader, 
        name, 
        email, 
        phone,
        studentCard,
        poster,
        twibbon
    }:
    {
        isTeamLeader?: boolean, 
        name: string, 
        email: string, 
        phone: string,
        studentCard?: Media,
        poster?: Media,
        twibbon?: Media
    }
) {
    const studentCardUrl = studentCard?.url ? studentCard.url : '#';
    const posterUrl = poster?.url ? poster.url : '#';
    const twibbonUrl = twibbon?.url ? twibbon.url : '#';

    return (
        <div className="relative px-5 py-4 border border-white flex flex-col gap-3 rounded-lg">
            {isTeamLeader && <Tag variant="lilac" text="Team Leader" className="absolute right-4 top-3 w-fit px-5 bg-white"/>}
            <Field title="Name" value={name} />
            <Field title="Email" value={email} />
            <Field title="Phone" value={phone? phone : '-'} />
            <FileRequirements filetype="Student ID Card" url={studentCardUrl} editable={!isTeamLeader}/>
            <FileRequirements filetype="Poster" url={posterUrl}  editable={!isTeamLeader} />
            <FileRequirements filetype="Twibbon" url={twibbonUrl}  editable={!isTeamLeader}/>
        </div>
    )
}

export function TeamStatus(
    {
        stage,
        qualifications,
        stageWin,
        stageSuccess,
        stageFailed
    }
    :
    {
        stage: 'Pre-eliminary' | 'Final',
        qualifications: MenuItem[],
        stageWin?: string[]
        stageSuccess: string[]
        stageFailed?: string[]
    }
) {
    const [hidden, setHidden] = useState<boolean>(false);
    const [qualification, setQualification] = useState<MenuItem | null>(null);

    const isWin = (qualification?.option) ? stageWin?.includes(qualification.option) : false;
    const isSuccess = (qualification?.option) ? stageSuccess.includes(qualification.option) : false;
    const isFailed = (qualification?.option) ? stageFailed?.includes(qualification.option) : false;
    const qualificationStatus = isWin? 'lilac' : isSuccess ? 'success' : isFailed ? 'danger' : 'warning';

    return (
        <div 
            className={
                cn(
                    "flex justify-between items-center mt-5",
                    hidden ? 'md:flex-row flex-col' : ''
                )
            }
        >
            <div>
                <h1 className="font-teachers font-bold text-[32px]">{stage}</h1>
            </div>
            {
                !hidden && (
                    <div className="flex items-center gap-3">
                        <Tag variant={qualificationStatus} text={qualification?.option ? qualification?.option : 'On Review'} className="w-fit px-6"/>
                        <Pencil size={25} className="text-white hover:cursor-pointer" strokeWidth={2.4} onClick={() => {setHidden(true)}}/>
                    </div>
                )
            }
            {
                hidden && (
                    <div className="flex gap-2 items-center mt-3">
                        <Dropdown 
                            data={qualifications} 
                            onChange={(e) => {setQualification(e)}} 
                            value={qualification}
                        />
                        <div className="flex gap-2 flex-row pb-2">
                            <Button variant={'outline'} size={'sm'} onClick={() => {setHidden(false)}}>
                                <X size={10} className="text-white" strokeWidth={3} />
                            </Button>
                            <Button size={'sm'} onClick={() => {setHidden(false)}}>
                                <Check size={10}  strokeWidth={3} />
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default function TeamInfo({members, existsSubmission} : GetTeamDetailResponse) {
    
    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] py-[1rem] font-dmsans">
            <div className="mb-3 mr-2">
                <h1 className="font-teachers font-bold text-[32px]">Verfication</h1>
            </div>
            <PaymentProof />
            <div className={cn("xl:grid-cols-3 grid-cols-1 gap-7", members ? 'grid' : 'hidden')}>
                {
                    members && 
                    members.map((member, index) => (
                        <MemberCard 
                            key={index} 
                            name={member.user?.fullName ? member.user.fullName : DEFAULT_FIELD } 
                            email={member.user?.email ? member.user?.email : DEFAULT_FIELD} 
                            phone={member.user?.phoneNumber ? member.user.phoneNumber.toString() : DEFAULT_FIELD} 
                            isTeamLeader={member.role === 'leader'}
                        />
                    ))
                }
            </div>
            {
                !existsSubmission && (
                    <>
                        <TeamStatus 
                            stage='Final'
                            qualifications={
                                [
                                    {id: 1, option: "Juara 1"}, 
                                    {id: 2, option: "Juara 2"},
                                    {id: 3, option: "Juara 3"},
                                    {id: 4, option: "Juara Harapan 1"},
                                    {id: 5, option: "Juara Harapan 2"},
                                    {id: 6, option: "Juara Harapan 3"},
                                ]
                            }
                            stageWin={['Juara 1', 'Juara 2', 'Juara 3']}
                            stageSuccess={['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3']}
                        />
                        <TeamStatus 
                            stage='Pre-eliminary'
                            qualifications={
                                [
                                    {id: 1, option: "Pass"}, 
                                    {id: 2, option: "Not Pass"},
                                    {id: 3, option: "On Review"},
                                ]
                            }
                            stageSuccess={['Pass']}
                            stageFailed={['Not Pass']} 
                        />
                    </>
                )
            }
        </div>
    )
}