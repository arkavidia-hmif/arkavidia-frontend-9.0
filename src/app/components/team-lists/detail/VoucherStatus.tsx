import { useEffect, useState } from 'react'
import Tag from '../../Tag'
import { getAdminCompetitionTeamInformation } from '~/api/generated'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

interface VoucherStatusProps {
  competitionId: string
  teamId: string
}

export const VoucherStatus = ({ competitionId, teamId }: VoucherStatusProps) => {
  const [voucher, setVoucher] = useState<RenderVoucherStatusProps>()
  const axiosClient = useAxiosAuth()
  useEffect(() => {
    async function fetchVoucherForAdmin() {
      try {
        const response = await getAdminCompetitionTeamInformation({
          client: axiosClient,
          path: {
            competitionId: competitionId,
            teamId: teamId
          }
        })

        if (!response.data) {
          return
        }

        const voucher = response.data.voucer
        let voucherStatus: 'unsubmitted' | 'submitted' | 'verified' = 'unsubmitted'

        if (voucher) {
          voucherStatus = 'submitted'
        }

        if (response.data.eligibleForVoucer) {
          voucherStatus = 'verified'
        }

        const teamVoucher: RenderVoucherStatusProps = {
          status: voucherStatus,
          discount: voucher?.discount ?? undefined,
          teamCount: voucher?.requiredTeamCount,
          voucherCode: voucher?.code
        }
        setVoucher(teamVoucher)
      } catch (e) {
        console.error(e)
      }
    }
    fetchVoucherForAdmin()
  }, [])
  return (
    <RenderVoucherStatus
      status={voucher?.status ?? 'unsubmitted'}
      discount={voucher?.discount}
      teamCount={voucher?.teamCount}
      voucherCode={voucher?.voucherCode}
    />
  )
}

interface RenderVoucherStatusProps {
  status: 'unsubmitted' | 'submitted' | 'verified'
  teamCount?: number
  discount?: number
  voucherCode?: string
}

//Rendering Component
const RenderVoucherStatus = ({
  status,
  teamCount,
  discount,
  voucherCode
}: RenderVoucherStatusProps) => {
  function getStatusColor(status: string) {
    if (status === 'verified') {
      return 'success'
    } else if (status === 'submitted') {
      return 'purple'
    } else {
      return 'neutral'
    }
  }

  function toPascalCase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="font-teachers text-[28px] font-bold">Voucher</h1>
      <div className='className="container flex w-full flex-row-reverse justify-between gap-2 rounded-xl border border-white p-4'>
        <span>
          <Tag
            variant={getStatusColor(status)}
            text={toPascalCase(status.toString().toWellFormed())}
          />
        </span>
        <span className="flex flex-col gap-4">
          {voucherCode ? (
            <div className="flex flex-col text-base">
              <span>
                <b>Kode Voucher saat ini</b>
              </span>
              <span className="font-light">{voucherCode}</span>
            </div>
          ) : null}

          {teamCount ? (
            <div className="flex flex-col text-base">
              <span>
                <b>Syarat Jumlah Team minimal yang memiliki voucher yang sama</b>
              </span>
              <span className="font-light">{teamCount}</span>
            </div>
          ) : null}

          {discount ? (
            <div className="flex flex-col text-base">
              <span>
                <b>Nominal Discount</b>
              </span>
              <span className="font-light">Rp. {discount}</span>
            </div>
          ) : null}
        </span>
      </div>
    </div>
  )
}
