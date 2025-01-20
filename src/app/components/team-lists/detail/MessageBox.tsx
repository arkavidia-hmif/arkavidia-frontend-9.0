import React, { useState } from 'react'
import TextArea from '../../TextArea'
import { updateSubmissionFeedback } from '~/api/generated'
import { Button } from '../../Button'
import useAxiosAuth from '~/lib/hooks/useAxiosAuth'
import { useToast } from '~/hooks/use-toast'
import { useParams } from 'next/navigation'

interface MessageBoxProps {
  typeId: string
}

const MessageBox = ({ typeId }: MessageBoxProps) => {
  const params = useParams()
  const { toast } = useToast()
  const axiosAuth = useAxiosAuth()
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!params.teamId || Array.isArray(params.teamId)) {
        throw new Error('Invalid team ID')
      }

      await updateSubmissionFeedback({
        client: axiosAuth,
        path: {
          teamId: params.teamId,
          typeId
        },
        body: {
          feedback: message
        }
      })

      toast({
        title: 'Feedback sent',
        variant: 'success'
      })
      setMessage('')
    } catch (error) {
      toast({
        title: 'Failed to send feedback',
        description: (error as Error).message,
        variant: 'destructive'
      })
    }
  }

  return (
    <form className="flex flex-col items-end gap-6" onSubmit={onSubmit}>
      <TextArea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Send Message"
      />
      <Button className="min-w-48 max-w-[200px]" type="submit">
        Send
      </Button>
    </form>
  )
}

export default MessageBox
