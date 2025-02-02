import { expandCompetitionName } from '~/lib/utils'

function getSidebarURL({
  isAdmin,
  competitionName,
  eventName
}: {
  isAdmin: boolean
  competitionName?: string
  eventName?: string
}) {
  let url = '/dashboard'
  if (isAdmin) {
    url += '/admin'
  }

  if (competitionName) {
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
  } else if (eventName) {
    /**
     *  Format event name, for example 'Akademya - Software Engineering' will be converted into
     * 'akademya-software-engineering'
     *  */

    url += `/${eventName
      .replace(' - ', '-') // Replace " - " with "-"
      .replace(/\s+/g, '-') // Convert spaces to hyphens
      .toLowerCase()
    }`
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
