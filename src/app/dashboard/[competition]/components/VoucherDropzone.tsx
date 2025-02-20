'use client'

import { useState } from 'react'
import { Button } from '~/app/components/Button'
import { Input } from '~/app/components/Input'

interface VoucherDropzoneProps {
  onSubmitVoucher: (voucherCode: string) => Promise<void>
}

const VoucherDropzone: React.FC<VoucherDropzoneProps> = ({ onSubmitVoucher }) => {
  const [voucherCode, setVoucherCode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!voucherCode.trim()) {
      setError('Please enter a voucher code.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmitVoucher(voucherCode.trim())
      setVoucherCode('')
    } catch (err) {
      setError('An error occurred during submission. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#DBCDEF] bg-transparent px-4 py-10 text-center">
        <Input
          value={voucherCode}
          onChange={e => setVoucherCode(e.target.value)}
          placeholder="Enter Voucher Code"
          className="w-full max-w-md"
        />
        {error && <p className="mt-2 text-sm font-semibold text-red-400">{error}</p>}
      </div>
      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white"
          onClick={handleSubmit}
          disabled={!voucherCode || isSubmitting}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default VoucherDropzone
