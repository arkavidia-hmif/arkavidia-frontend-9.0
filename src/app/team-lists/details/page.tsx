import { Tab } from "~/app/components/Tab";
import TeamInfo from "~/app/components/team-lists/detail/TeamInfo";
import Submission from "~/app/components/team-lists/detail/Submission";

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
            <Tab contentType={['Team Information', 'Submission']} content={[<TeamInfo/>,<Submission />]} />
        </div>  
    )
}

export default TeamDetails;