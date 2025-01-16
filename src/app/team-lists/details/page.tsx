"use client";

import { Tab } from "~/app/components/Tab";
import TeamInfo from "~/app/components/team-lists/detail/TeamInfo";
import Submission from "~/app/components/team-lists/detail/Submission";
import { useEffect, useState } from "react";
import { getTeamDetail, GetTeamDetailResponse } from "~/api/generated";
import useAxiosAuth from "~/lib/hooks/useAxiosAuth";
import { axiosInstance } from "~/lib/axios";

type Competition = 'CP' | 'CTF' | 'HACKVIDIA' | 'UXVIDIA' | 'DATAVIDIA';

function TeamDetails() {
    const [competition, setCompetition] = useState<Competition>('CP');
    const [teamData, setTeamData] = useState<GetTeamDetailResponse>();
    const axiosAuth = useAxiosAuth();

    useEffect(() => {
        let isMounted = true;

        const fetchTeamData = async () => {
            try {
                const resp = await getTeamDetail({
                    client: axiosAuth,
                    path: {
                        teamId: 'es3hvk58',
                        competitionId: 'zrl4bjpi'
                    }
                });
                
                if (isMounted) {
                    setTeamData(resp.data);
                    console.log("Team data fetched:", resp.data);
                }
            } catch (err) {
                console.error("Team data fetch error:", err);
                throw err;
            }
        };

        const initializeData = async () => {
            try {
                // await handleLogout();
                // await handleLogin();
                await fetchTeamData();
            } catch (err) {
                console.error("Initialization sequence failed:", err);
            }
        };

        initializeData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [axiosAuth]); // Add axiosAuth as dependency

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
            {
                competition === 'UXVIDIA' || competition === 'DATAVIDIA' ? (
                    <Tab 
                        contentType={['Team Information', 'Submission']} 
                        content={[
                            <TeamInfo key="team-info" members={teamData?.teamMembers} existsSubmission/>,
                            <Submission key="submission" />
                        ]} 
                    />
                ) : (
                    <Tab 
                        contentType={['Team Information']} 
                        content={[
                            <TeamInfo key="team-info" members={teamData?.teamMembers}/>,
                        ]} 
                    />
                )  
            }
        </div>
    );
}

export default TeamDetails;