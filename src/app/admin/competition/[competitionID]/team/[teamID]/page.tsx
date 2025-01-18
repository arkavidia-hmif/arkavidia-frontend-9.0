"use client";

import { Tab } from "~/app/components/Tab";
import TeamInfo from "~/app/components/team-lists/detail/TeamInfo";
import Submission from "~/app/components/team-lists/detail/Submission";
import { useEffect, useState } from "react";
import { getCompetitionSubmissionTeam, getTeamDetail, GetTeamDetailResponse } from "~/api/generated";
import useAxiosAuth from "~/lib/hooks/useAxiosAuth";
import { useParams, useRouter } from "next/navigation";
import Hero from "~/app/components/team-lists/detail/Hero";

type Competition = 'cp' | 'ctf' | 'hackvidia' | 'uxvidia' | 'datavidia';

const URL_PLACEHOLDER = 'https://picsum.photos/200/300'

const payment_placeholder = {
    url: URL_PLACEHOLDER,
    typeID: '12'
}

// submissionsTypeID: {
//     name: string;
//     studentCard: string;
//     poster: string;
//     twibbon: string;
// }

const submission_placeholder = [
    {
        name: 'Participant 1',
        studentCard: URL_PLACEHOLDER,
        poster: URL_PLACEHOLDER,
        twibbon: URL_PLACEHOLDER,
    },
    {
        name: 'Participant 2',
        studentCard: URL_PLACEHOLDER,
        poster: URL_PLACEHOLDER,
        twibbon: URL_PLACEHOLDER,
    },
    {
        name: 'Participant 3',
        studentCard: URL_PLACEHOLDER,
        poster: URL_PLACEHOLDER,
        twibbon: URL_PLACEHOLDER
    }
]

function isCompetition(value: string | null): value is Competition {
    // TODO: Uncomment this when the competition ID is finalized
    // return ['cp', 'ctf', 'hackvidia', 'uxvidia', 'datavidia'].includes(value as Competition);
    return true;
}

function TeamDetails() {
    const router = useRouter();
    const params = useParams();
    const [competition, setCompetition] = useState<Competition>();
    const [teamData, setTeamData] = useState<GetTeamDetailResponse>();
    const axiosAuth = useAxiosAuth();

    useEffect(() => {
        const competitionParam = params.competitionID as string;

        if (!competitionParam || !isCompetition(competitionParam)) {
            router.push('/404');
            return;
        }

        setCompetition(competitionParam);

        let isMounted = true;

        const fetchTeamData = async () => {
            const resp = await getTeamDetail({
                client: axiosAuth,
                path: {
                    teamId: params.teamID as string,
                    competitionId: competitionParam
                }
            });
            
            if (resp.error || !resp.data) {
                router.push('/404');
                return;
            }

            if (isMounted) {
                setTeamData(resp.data);
            }
        };

        // TODO: Integrate
        const fetchTeamSubmission = async () => {
            const resp = await getCompetitionSubmissionTeam({
                client: axiosAuth,
                path: {
                    teamId: params.teamID as string,
                }
            })
        }


        fetchTeamData();
        fetchTeamSubmission();

        return () => {
            isMounted = false;
        };
    }, [params, axiosAuth]);

    if (!teamData) {
        return ;
    }

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
                teamStatus={teamData.isVerified? 'Verified' : 'Unverified'}
                teamStage={} 
            />
            {competition && (
                competition === 'uxvidia' || competition === 'datavidia' ? (
                    <Tab 
                        contentType={['Team Information', 'Submission']} 
                        content={[
                            <TeamInfo 
                                key="team-info"
                                members={teamData?.teamMembers}
                                paymentProof={payment_placeholder}
                                teamID={teamData.id}
                                submissionsTypeID={submission_placeholder}
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
                                paymentProof={payment_placeholder}
                                submissionsTypeID={submission_placeholder}   
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