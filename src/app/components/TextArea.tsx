import React from 'react'
import { Textarea } from './ui/textarea'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  state?: 'default' | 'error' | 'success'
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function TextArea({
  label = 'label',
  value,
  state = 'default',
  onChange,
  required,
  ...props
}: TextAreaProps) {
  const borderColor =
    state === 'error'
      ? 'border-red-500'
      : state === 'success'
        ? 'border-green-500'
        : 'border-gray-300'
  return (
    <div className="flex flex-col gap-1 text-left font-dmsans">
      <label>
        <span className="text-xl text-lilac-100">{label}</span>
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Textarea
        className={`rounded-md border-2 p-2 ${borderColor} border-purple-400 bg-purple-100 text-purple-400`}
        value={value}
        onChange={onChange}
        placeholder="Type Something Here"
        required={required}
        {...props}
      />
      <label className="text-sm text-purple-100">Helper</label>
    </div>
  )
}

export default TextArea
