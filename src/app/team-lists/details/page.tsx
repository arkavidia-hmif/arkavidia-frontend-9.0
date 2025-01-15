"use client";

import { Tab } from "~/app/components/Tab";
import TeamInfo from "~/app/components/team-lists/detail/TeamInfo";
import Submission from "~/app/components/team-lists/detail/Submission";
import { useEffect, useState } from "react";
import { basicLogin, getTeamDetail, GetTeamDetailResponse, TeamMember } from "~/api/generated";
import useAxiosAuth from "~/lib/hooks/useAxiosAuth";
import { axiosInstance } from "~/lib/axios";

function TeamDetails() {
    const [teamData, setTeamData] = useState<GetTeamDetailResponse>();
    const axiosAuth = useAxiosAuth();

    useEffect(() => {
        const login = async () => {
            try {
                const resp = await basicLogin(
                    {
                        client: axiosInstance,
                        body: {
                            email: 'admin@example.com',
                            password: 'password'
                        }
                    }
                );

                console.log("Login")
                console.log(resp.status)
                console.log(resp.data)
            } catch (err) {
                console.log(err)
            }
        }

        const fetchTeamData = async () => {
            try {
                const resp = await getTeamDetail(
                    {
                        client: axiosAuth,
                        path: {
                            teamId: 'es3hvk58',
                            competitionId: 'zrl4bjpi'
                        }
                    }
                );
    
                setTeamData(resp.data);
                console.log(resp.data)
            } catch (err) {
                console.log(err);
            }

        }

        const fetchTest = async () => {
            await login();
            await fetchTeamData();
        }

        fetchTest();
        // login();
        // fetchTeamData();
    }, [])

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
            <Tab contentType={['Team Information', 'Submission']} content={[<TeamInfo members={teamData?.members}/>,<Submission />]} />
        </div>  
    )
}

export default TeamDetails;