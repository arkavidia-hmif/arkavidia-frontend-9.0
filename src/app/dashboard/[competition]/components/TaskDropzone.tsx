'use client'

import axios from 'axios'
import { CloudUpload } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { getPresignedLink, GetPresignedLinkData } from '~/api/generated'
import { Button } from '~/app/components/Button'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'

interface TaskDropzoneProps {
  bucket: GetPresignedLinkData['query']['bucket']
  onSubmitMedia: (mediaId: string, bucket: string, type: string) => Promise<void>
  submissionTypeId?: string
}

const fileTypeAssets = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/zip': 'ZIP',
  'application/x-zip-compressed': 'ZIP',
  default: 'TXT'
}

const TaskDropzone: React.FC<TaskDropzoneProps> = ({
  bucket,
  submissionTypeId,
  onSubmitMedia
}) => {
  const axiosAuth = useAxiosAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const validateInputFile = (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ]
    const maxSizeMB = 20

    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload JPEG, PNG, PDF, or DOCX files.')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB. Please upload a smaller file.`)
      return
    }

    setSelectedFile(file)
  }

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setError(null)
    const file = event.dataTransfer.files?.[0]
    if (file) validateInputFile(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = event.target.files?.[0]
    if (file) validateInputFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setError(null)

    try {
      const response = await getPresignedLink({
        client: axiosAuth,
        query: {
          filename: selectedFile.name,
          bucket: bucket
        }
      })

      if (response.status !== 200 || !response.data?.presignedUrl) {
        throw new Error('Failed to get presigned URL')
      }

      const { presignedUrl, mediaId } = response.data

      // Upload to S3
      await axios.put(presignedUrl, selectedFile, {
        headers: { 'Content-Type': selectedFile.type }
      })

      await onSubmitMedia(mediaId, bucket, submissionTypeId || '')
      setSelectedFile(null)
    } catch {
      setError('An error occurred during upload. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} bytes`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleFileDrop}
        onDragOver={e => e.preventDefault()}
        className="mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#DBCDEF] bg-transparent px-4 py-10 text-center">
        <CloudUpload className="mb-6" />
        <div className="flex text-sm text-[#DBCDEF] md:text-base">
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-4 hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mr-2 cursor-pointer font-semibold underline">
            Click to upload
          </label>
          <p className="font-light">or drag and drop</p>
        </div>
        <p className="mt-1 text-xs text-[#8C8C8C]">
          Supported formats: JPEG, PNG, PDF, DOCX, ZIP (Max 20MB)
        </p>

        {error && <p className="mt-2 text-sm font-semibold text-red-400">{error}</p>}
      </div>

      {/* Display Selected File */}
      {selectedFile && (
        <div className="flex w-full items-center justify-start gap-4 rounded-lg border-[1px] border-white px-4 py-3">
          <Image
            src={`/icons/fileinputassets/${fileTypeAssets[selectedFile.type as keyof typeof fileTypeAssets] || fileTypeAssets.default}.svg`}
            alt="Selected File"
            width={50}
            height={50}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <p className="font-semibold">{selectedFile.name}</p>
            <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
          </div>
          <div className="ml-auto px-2">
            <FaTrash className="cursor-pointer" onClick={() => setSelectedFile(null)} />
          </div>
        </div>
      )}
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-gradient-to-br from-[#48E6FF] via-[#9274FF] to-[#C159D8] text-white"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default TaskDropzone
