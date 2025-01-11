import React from "react";
import { RegisteredTeamList } from "../components/registered-teamlist/teamlist";


const CompetitiveProgrammingTeamList = () => {
    const teamData = []
    const teamStatus = ['Verified', 'Waiting', 'Denied']
    const competitionStatus = ['Pre-eliminary', 'Final']
    
    for (let i = 0; i < 1250  ; i++) {
      teamData.push({
        teamId: `ABCD${i}`,
        teamName: `Team ${i}`,
        teamStatus: teamStatus[Math.floor(Math.random() * 3)],
        teamCompetitionStatus: competitionStatus[Math.floor(Math.random() * 2)]
      })
    }
    return (
        <RegisteredTeamList team-data={teamData}>
        </RegisteredTeamList>
    )
}

export default CompetitiveProgrammingTeamList