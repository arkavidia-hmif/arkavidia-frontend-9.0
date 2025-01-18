'use client'

import React, { useEffect } from 'react'
import ComingSoon from '~/app/components/404-coming-soon/ComingSoon'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { self, getTeamDetail } from '~/api/generated'
import { useLoginRedirect } from '~/lib/hooks/useRedirect'

function Page() {
  useLoginRedirect()
  const authAxios = useAxiosAuth()

  useEffect(() => {
    async function fun() {
      const test = await getTeamDetail({
        client: authAxios,
        path: {
          teamId: 'es3hvk58',
          competitionId: 'zrl4bjpi'
        }
      })

      console.log(test.data)
    }

    fun()
  }, [])
  return <ComingSoon />
}

export default Page
