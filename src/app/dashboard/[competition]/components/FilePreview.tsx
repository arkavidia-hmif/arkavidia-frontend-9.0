import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface FilePreviewProps {
  fileURL?: string
  name?: string
}

function FilePreview({ fileURL, name }: FilePreviewProps) {
  if (!fileURL || !name) {
    return null
  }

  return (
    <div className="mt-4">
      <div className="flex gap-x-3">
        <h1 className="font-teachers text-xl font-bold">Dokumen saat ini</h1>
        <ExternalLink strokeWidth={2} />
      </div>
      <Link className="underline" href={'https://' + fileURL}>
        <p className="font-dmsans text-[1rem] text-lg font-normal hover:underline">
          {name}
        </p>
      </Link>
    </div>
  )
}

export default FilePreview
