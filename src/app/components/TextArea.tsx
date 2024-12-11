import React from 'react'
import { Textarea } from './ui/textarea'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  state?: 'default' | 'error' | 'success' | 'warn'
  helperText?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function TextArea({
  label = 'Label',
  value,
  state = 'default',
  onChange,
  required,
  helperText = '',
  disabled,
  ...props
}: TextAreaProps) {
  return (
    // diatur w-full supaya ngatur lebar textarea sesuai parentnya
    <div className="flex w-full flex-col gap-1 text-left font-dmsans">
      <label>
        <span className="text-xl text-lilac-100">{label}</span>
        {required && <span className="text-red-500"> *</span>}
      </label>
      <Textarea
        className={`rounded-md border-2 p-2 ${
          state === 'error'
            ? 'border-red-500 text-red-500'
            : state === 'success'
              ? 'border-green-500 text-green-500'
              : state === 'warn'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-purple-400 text-purple-800'
        } bg-lilac-100 placeholder-opacity-100 placeholder:text-purple-400 hover:border-purple-300 hover:bg-lilac-200 focus:border-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 focus-visible:ring-opacity-50 disabled:cursor-not-allowed disabled:border-neutral-650 disabled:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-neutral-300`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      />
      {helperText && (
        <label
          className={`text-pretty text-sm ${
            state === 'error'
              ? 'text-red-500'
              : state === 'success'
                ? 'text-green-500'
                : state === 'warn'
                  ? 'text-yellow-500'
                  : 'text-purple-100'
          }`}>
          {helperText}
        </label>
      )}
    </div>
  )
}

export default TextArea
