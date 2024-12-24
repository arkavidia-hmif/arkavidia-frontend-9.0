import {
  TeamInformationContent,
  TeamInformationDefaultValue,
} from '../components/competition/TeamInformationContent'
import { Tab } from '../components/Tab'

const DummyPersonalInfoData: TeamInformationDefaultValue = {
  name: 'Ahdmad Jone Done',
}


const ProfilePage = () => {
  return (
    <div
      className="relative md:min-h-screen bg-gradient-to-r from-[#1F0246] to-[#2E046A] px-6 max-h-fit"
      style={{
        backgroundImage: "url('/images/profile/bg.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Tab
        contentType={["Team Information", "Announcement", "Task List", "Verification"]}
        content={[
          <TeamInformationContent name={DummyPersonalInfoData.name}/>,
          <div />,
          <div />,
          <div />
        ]}
      />
    </div>
  )
}

export default ProfilePage
