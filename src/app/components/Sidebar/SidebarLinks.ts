import { expandCompetitionName } from '~/lib/utils'

function getSidebarURL({
  isAdmin,
  competitionName
}: {
  isAdmin: boolean
  competitionName: string
}) {
  let url = '/dashboard'
  if (isAdmin) {
    url += '/admin'
  }

  switch (competitionName) {
    case 'CP':
      url += '/CP'
      break
    case 'CTF':
      url += '/CTF'
      break
    case 'UXvidia':
      url += '/UXvidia'
      break
    case 'Arkalogica':
      url += '/Arkalogica'
      break
    case 'Datavidia':
      url += '/Datavidia'
      break
    case 'Hackvidia':
      url += '/Hackvidia'
      break
    default:
      break
  }

  return url
}

const getAdminLinks = () => {
  const list = ['CP', 'CTF', 'UXvidia', 'Arkalogica', 'Datavidia', 'Hackvidia']
  return list.map(name => ({
    name: expandCompetitionName(name),
    link: getSidebarURL({ isAdmin: true, competitionName: name })
  }))
}

export { getSidebarURL, getAdminLinks }
