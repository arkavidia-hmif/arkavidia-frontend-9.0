import { Check, ExternalLink, X } from "lucide-react";
import { Button } from "~/app/components/Button";
import { Tab } from "~/app/components/Tab";
import Tag from "~/app/components/Tag";

const dummy = {
    name: "Rafly Hanggaraksa",
    email: "rafly@example.com",
    phone: "081234567890"
}

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
    return (
        <div className="flex justify-between">
            <div className="flex gap-1 items-center">
                <ExternalLink size={24} />
                <div className="mt-1">
                    <p>{filetype}</p>
                </div>
            </div>
            {
                editable ? 
                    <div className="flex gap-5">
                        <Button variant={'outline'} size={'sm'}>
                            <X size={10} className="text-white" strokeWidth={3} />
                        </Button>
                        <Button size={'sm'}>
                            <Check size={10}  strokeWidth={3}/>
                        </Button>
                    </div> 
                    : 
                    <div>
                        <Check size={30}  strokeWidth={2}/>
                    </div>
            }
            
        </div>
    )
}

function MemberCard({isTeamLeader}: {isTeamLeader?: boolean}) {
    return (
        <div className="relative px-5 py-4 border border-white flex flex-col gap-3 rounded-lg">
            {isTeamLeader && <Tag variant="lilac" text="Team Leader" className="absolute right-4 top-3 w-fit px-5 bg-white"/>}
            <Field title="Name" value={dummy.name} />
            <Field title="Email" value={dummy.email} />
            <Field title="Phone" value={dummy.phone} />
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

function TeamInfo() {
    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] py-[1rem] font-dmsans">
            <PaymentProof />
            <div className="grid xl:grid-cols-3 grid-cols-1 gap-7">
                <MemberCard isTeamLeader/>
                <MemberCard />
                <MemberCard />
            </div>
        </div>
    )
}

function TeamDetails() {
    return (
        <div
            className="min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A]"
            style={{
                backgroundImage: "url('/images/profile/bg.png')",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
        >
            <Tab contentType={['Team Information']} content={[<TeamInfo/>]} />
        </div>  
    )
}

export default TeamDetails;