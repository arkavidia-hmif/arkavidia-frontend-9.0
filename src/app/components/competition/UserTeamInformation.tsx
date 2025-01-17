'use client';

import { getTeams, getTeamMember } from '~/api/generated';
import useAxiosAuth from '~/lib/hooks/useAxiosAuth';
import { useEffect, useState } from 'react';
import type { Team, TeamMember } from '~/api/generated/types.gen';
import { TeamInformationContent } from './TeamInformationContent';

export const UserTeamInformation = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<{ name: string; verified: boolean; title: string }[]>([]); 
  const [loading, setLoading] = useState(true); 
  const authAxios = useAxiosAuth(); 

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams({ client: authAxios }); 
        const teams = response.data;

        if (Array.isArray(teams) && teams.length > 0) {
          setTeam(teams[0]); 
        } else {
          console.warn('No teams found for the user.');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [authAxios]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!team?.id) return;
  
      try {
        const response = await getTeamMember({
          client: authAxios,
          path: { teamId: team.id },
        });
  
        const transformedMembers = Array.isArray(response.data)
          ? response.data.map((member: TeamMember) => ({
              name: member.user?.fullName || 'No Name',
              verified: member.isVerified,
              title: member.role || 'Member',
            }))
          : [];
  
        setTeamMembers(transformedMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false); 
      }
    };
  
    if (team) {
      fetchTeamMembers();
    }
  }, [authAxios, team]);
  

  if (loading) {
    return <div>Loading Team Information...</div>; 
  }

  if (!team) {
    return <div>No Teams Found.</div>; 
  }

  return (
    <TeamInformationContent
      teamName={team.name} 
      members={teamMembers} 
    />
  );
};

export default UserTeamInformation;
