'use server'

import { useEffect, useState } from 'react';
import {
  TeamInformationContent,
} from '../components/competition/TeamInformationContent';
import { Tab } from '../components/Tab';

const TestPage = () => {
  // Placeholder Buat Data
  const placeholderData = {
    teamName: 'Sample Team',
    members: [
      { name: 'John Doe', verified: true, title: 'Member 1' },
      { name: 'Jane Doe', verified: true, title: 'Member 2' },
      { name: 'Ali Doe', verified: false, title: 'Member 3' },
    ],
  };

  const [teamName, setTeamName] = useState(placeholderData.teamName);
  const [members, setMembers] = useState(placeholderData.members);
  
  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/team-data');
        const data = await response.json();

        setTeamName(data.teamName);
        setMembers(data.members);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } 
    };

    fetchData();
  }, []);

  return (
    <div
      className="relative md:min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A] px-6 max-h-fit"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Tab Component */}
      {/* jumlah content menyesuaikan jumlah contentType aja, tinggal panggil reactNode */}
      <Tab
        contentType={["Team Information", "Announcement", "Task List", "Verification"]}
        content={[
          <TeamInformationContent teamName={teamName} members={members} />,
          <div />,
          <div />,
          <div />
        ]}
      />
    </div>
  );
};

export default TestPage;
