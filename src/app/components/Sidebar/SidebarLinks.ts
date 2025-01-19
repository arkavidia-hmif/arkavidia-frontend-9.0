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
      url += '/cp'
      break
    case 'CTF':
      url += '/ctf'
      break
    case 'UXvidia':
      url += '/uxvidia'
      break
    case 'Arkalogica':
      url += '/arkalogica'
      break
    case 'Datavidia':
      url += '/datavidia'
      break
    case 'Hackvidia':
      url += '/hackvidia'
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
