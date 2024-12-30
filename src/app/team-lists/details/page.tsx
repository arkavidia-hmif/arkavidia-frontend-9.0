import { Check, ExternalLink, X } from "lucide-react";
import { Button } from "~/app/components/Button";
import { Tab } from "~/app/components/Tab";

function TeamInfo() {
    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] py-[1rem]">
            <div>
                <h1>Verification</h1>
            </div>

            <div>
                <div className="flex justify-between border border-white rounded-lg py-3 px-6 ">
                    <div className="flex gap-1 items-center">
                        <ExternalLink size={24} />
                        <div className="mt-1">
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