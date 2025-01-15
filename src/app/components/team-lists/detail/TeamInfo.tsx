import { Check, ExternalLink, SendHorizonal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TeamMember } from "~/api/generated";
import { Button } from "~/app/components/Button";
import Tag from "~/app/components/Tag";
import { cn } from "~/lib/utils";
import { Input } from "../../Input";

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
                <div className="flex justify-between border border-white rounded-lg py-3 px-6 ">
                    <div className="flex gap-1 items-center">
                        <ExternalLink size={24} />
                        <div className="mt-1 font-dmsans font-semibold text-lg">
                            <p>Payment Proof</p>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <Button variant={'outline'} size={'sm'}>
                            <X size={30} className="text-white" strokeWidth={3} />
                        </Button>
                        <Button size={'sm'}>
                            <Check size={30}  strokeWidth={3}/>
                        </Button>
                    </div>
                </div>
        </div>
    )
}

function FileRequirements({filetype, editable}: {filetype: string, editable?: boolean}) {
    const [isFeedback, setIsFeedback] = useState(false);

    return (
        <div className={cn("flex justify-between", isFeedback ? 'md:flex-row gap-2 flex-col' : '')}>
            <div className="flex gap-1 items-center">
                <ExternalLink size={24} />
                <div className="mt-1">
                    <Link href='https://picsum.photos/200/300'>
                        <p className="hover:underline hover:cursor-pointer">{filetype}</p>
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

function MemberCard({isTeamLeader, name, email, phone}: {isTeamLeader?: boolean, name: string, email: string, phone: string}) {
    return (
        <div className="relative px-5 py-4 border border-white flex flex-col gap-3 rounded-lg">
            {isTeamLeader && <Tag variant="lilac" text="Team Leader" className="absolute right-4 top-3 w-fit px-5 bg-white"/>}
            <Field title="Name" value={name} />
            <Field title="Email" value={email} />
            <Field title="Phone" value={phone? phone : '-'} />
            {
                isTeamLeader ?
                <>
                    <FileRequirements filetype="Student ID Card" />
                    <FileRequirements filetype="Poster" />
                    <FileRequirements filetype="Twibbon" />
                </>
                :
                <>
                    <FileRequirements filetype="Student ID Card" editable/>
                    <FileRequirements filetype="Poster" editable/>
                    <FileRequirements filetype="Twibbon" editable/>
                </>
            }
        </div>
    )
}

const TeamDummy = {
    data: [
        {
            name: 'John Doe 1',
            email: 'john1@example.com',
            phone: '08123456789'
        },
        {
            name: 'John Doe 2',
            email: 'john2@example.com',
            phone: '08123456789'
        },
        {
            name: 'John Doe 3',
            email: 'john3@example.com',
            phone: '08123456789'
        },
    ]
}

type GetTeamDetailResponse = {
    members?: Array<TeamMember> | undefined; // Make members optional
  };

const membersData = {
    data: [
        {
            name: 'John Doe 1',
            email: 'johndoe@example.com',
            phone: '08123456789'
        },
        {
            name: 'John Doe 1',
            email: 'johndoe@example.com',
            phone: '08123456789'
        },
        {
            name: 'John Doe 1',
            email: 'johndoe@example.com',
            phone: '08123456789'
        }
    ]
};

export default function TeamInfo({members} : GetTeamDetailResponse) {

    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] py-[1rem] font-dmsans">
            <PaymentProof />
            {/* <div className={cn("xl:grid-cols-3 grid-cols-1 gap-7", members ? 'grid' : 'hidden')}>
                {
                    members && 
                    members.map((member, index) => (
                        <MemberCard key={index} name={member.user.fullName ? member.user.fullName : '-' } email={member.user.email} phone={member.user.phoneNumber ? member.user.phoneNumber.toString() : '-'} isTeamLeader={member.role === 'leader'}/>
                        // <MemberCard key={index} name={member.name} email={member.email} phone={member.phone} isTeamLeader={index === 0}/>
                    ))
                }
            </div> */}
            <div className={cn("grid xl:grid-cols-3 grid-cols-1 gap-7")}>
                {
                    // members && 
                    // members.map((member, index) => (
                    //     <MemberCard key={index} name={member.user.fullName ? member.user.fullName : '-' } email={member.user.email} phone={member.user.phoneNumber ? member.user.phoneNumber.toString() : '-'} isTeamLeader={member.role === 'leader'}/>
                    //     // <MemberCard key={index} name={member.name} email={member.email} phone={member.phone} isTeamLeader={index === 0}/>
                    // ))
                    membersData && 
                    membersData.data.map((member, index) => (
                        <MemberCard key={index} name={member.name} email={member.email} phone={member.phone} isTeamLeader={index === 0}/>
                    ))
                }
            </div>
        </div>
    )
}