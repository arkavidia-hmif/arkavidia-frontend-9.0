"use client";

import { Tab } from "~/app/components/Tab";
import TeamInfo from "~/app/components/team-lists/detail/TeamInfo";
import Submission from "~/app/components/team-lists/detail/Submission";
import { useEffect, useState } from "react";
import { getCompetitionById, getAdminCompetitionTeamInformation, GetAdminCompetitionTeamInformationResponse, TeamMemberDocument, UserDocument } from "~/api/generated";
import useAxiosAuth from "~/lib/hooks/useAxiosAuth";
import { useToast } from "~/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import Hero from "~/app/components/team-lists/detail/Hero";
import { getTeamStatus } from "~/app/components/registered-teamlist/teamlist";

type Competition = 'CP' | 'CTF' | 'Hackvidia' | 'UXvidia' | 'Datavidia';


type submissionsTypeID = {
    name: string;
    studentCard: UserDocument | null;
    poster: TeamMemberDocument | null;
    twibbon: TeamMemberDocument | null;
}[];

/* ASSUMPTIONS
* IF there are for example several payment proofs or posters or twibbons, frontend WILL only get the latest file
*/


function TeamDetails() {
    const router = useRouter();
    const params = useParams();
    const [competition, setCompetition] = useState<Competition>();
    const [teamData, setTeamData] = useState<GetAdminCompetitionTeamInformationResponse>();
    const [teamSubmission, setTeamSubmission] = useState<submissionsTypeID>()
    const axiosAuth = useAxiosAuth();
    
    async function validateCompetition(value: string | null): Promise<boolean> {
        if (!value) {
            return false;
        }
        const resp = await getCompetitionById({
            client: axiosAuth,
            path: {
                competitionId: value 
            }
        });
        
        if (resp.error || !resp.data || resp.status !== 200) {
            return false;
        }
        setCompetition(resp.data.title as Competition);
        
        // Check by getCompetitionById is enough; if the getCompetitionById fails, that means no such competition ID
        return true;
    }
    
    
    const {toast} = useToast()
    useEffect(() => {
        const competitionParam = params.competitionID as string;
        const teamIdParam = params.teamID as string;
    
        if (!competitionParam || !validateCompetition(competitionParam)) {
            toast({
                title: 'Competition not found',
                variant: 'destructive'
            });
            router.replace('/404');
            return;
        }
    
        const fetchTeamData = async () => {
            const resp = await getAdminCompetitionTeamInformation({
                client: axiosAuth,
                path: {
                    teamId: teamIdParam,
                    competitionId: competitionParam
                }
            });
    
            if (resp.error || !resp.data) {
                const responseError = resp.error;
    
                // Check if it's a ValidationError
                if ('validationErrors' in responseError) {
                    toast({
                        title: 'Validation Error of fetching team data',
                        description: 'Unknown validation error.',
                        variant: 'destructive',
                    });
                } else if ('error' in responseError) {
                    toast({
                        title: 'Failed to fetch team data',
                        description: responseError.error || 'An unknown error occurred.',
                        variant: 'destructive',
                    });
                }
                router.replace('/404');
                return;
            }
    
            setTeamData(resp.data);
        };
    
        fetchTeamData();
    }, [params, axiosAuth]);
    
    useEffect(() => {
        if (!teamData) return;
    
        // Fetch submission data after `teamData` is loaded
        const tempTeamSubmission: submissionsTypeID = [];
        teamData.teamMembers?.forEach((member) => {
            let latestPoster: TeamMemberDocument | null = null;
            let latestTwibbon: TeamMemberDocument | null = null;
    
            const documents: TeamMemberDocument[] = Array.isArray(member.document)
                ? member.document
                : member.document
                    ? [member.document] // Wrap a single object into an array
                    : []; // Default to an empty array if null/undefined
    
            for (const doc of documents) {
                if (doc.type === "poster") {
                    if (
                        !latestPoster ||
                        new Date(doc.media.createdAt) > new Date(latestPoster.media.createdAt)
                    ) {
                        latestPoster = doc;
                    }
                } else if (doc.type === "twibbon") {
                    if (
                        !latestTwibbon ||
                        new Date(doc.media.createdAt) > new Date(latestTwibbon.media.createdAt)
                    ) {
                        latestTwibbon = doc;
                    }
                }
            }
    
            const tempMemberData = {
                name: member.user?.fullName || '',
                studentCard: (member.user?.document?.find((doc: UserDocument) => doc.type === "kartu-identitas")) || null,
                twibbon: latestTwibbon || null,
                poster: latestPoster || null,
            };
    
            tempTeamSubmission.push(tempMemberData);
        });
    
        setTeamSubmission(tempTeamSubmission);
    }, [teamData]);
    

    if (!teamData) {
        return ;
    }

    // NOTE: since there could be several payment proof, this method only takes the latest payment proof uploaded
    const paymentProof = (() => {
        if (!teamData.document || teamData.document.length === 0) {
          return null
        }
      
        // Find the latest document based on the createdAt field
        return teamData.document.reduce((latest, current) =>
          new Date(current.media.createdAt) > new Date(latest.media.createdAt) ? current : latest
        );

      })();

    return (
        <div
            className="flex flex-col gap-7 px-4 min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A]"
            style={{
                backgroundImage: "url('/images/profile/bg.png')",
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <Hero
                teamName={teamData.name}
                teamID={'#'+teamData.joinCode}
                teamStatus={getTeamStatus(teamData)}
                teamStage={teamData.stage} 
            />
            {competition && (
                competition === 'UXvidia' || competition === 'Datavidia' ? (
                    <Tab 
                        contentType={['Team Information', 'Submission']} 
                        content={[
                            <TeamInfo 
                                key="team-info"
                                members={teamData?.teamMembers}
                                paymentProof={paymentProof}
                                teamID={teamData.id}
                                submissionsTypeID={teamSubmission}
                                existsSubmission
                            />,
                            <Submission key="submission" />
                        ]} 
                    />
                ) : (
                    <Tab 
                        contentType={['Team Information']} 
                        content={[
                            <TeamInfo 
                                key="team-info"
                                members={teamData?.teamMembers}
                                paymentProof={paymentProof}
                                submissionsTypeID={teamSubmission}   
                                teamID={teamData.id}                      
                            />,
                        ]} 
                    />
                )
            )}
        </div>
    );
}

export default TeamDetails;