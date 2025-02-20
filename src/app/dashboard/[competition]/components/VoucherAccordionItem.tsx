interface VoucherAccordionItemProps {
  voucherCode?: string
  teamCount?: string
  discount?: string
  isVerified?: boolean
}
export const VoucherAccordionItem = ({
  voucherCode,
  teamCount,
  discount,
  isVerified
}: VoucherAccordionItemProps) => {
  return (
    <div className="flex flex-col">
      <p className="mb-4 md:text-[18px] lg:text-[21px]">
        Masukkan kode voucher di sini (Optional)
      </p>
      <div className="flex flex-col gap-2">
        {voucherCode ? (
          <p className="text-base">
            Kode Voucher saat ini : <b>{voucherCode}</b>
          </p>
        ) : null}

        {teamCount ? (
          <p className="text-base">
            Syarat Jumlah Team minimal yang menggunakan voucher yang sama: <b>{teamCount}</b>
          </p>
        ) : null}

        {discount && isVerified ? (
          <p className="text-base">
            Nominal Discount : <b>Rp. {discount}</b>
          </p>
        ) : null}
      </div>
    </div>
  )
}
