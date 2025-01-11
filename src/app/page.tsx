import { Input } from './components/Input'
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'


export default function Home() {
  return (
    <div className="p-4 grid gap-4 max-w-md mx-auto bg-gray-400">
      <Input
        label="Large Input (Default)"
        placeholder="Enter text..."
        helperText="This is a helper text"
        leftIcon={true}
      />

      <Input
        size="md"
        variant="unfilled"
        label="Medium Unfilled Input"
        placeholder="Search..."
        helperText="This is an unfilled input"
        leftIcon={true}
        rightIcon={true}
      />

      <Input
        variant='unfilled'
        state="success"
        label="Success Input"
        placeholder="Verified input"
        helperText="This input has been verified"
        leftIcon={true}
        rightIcon={true}
        disabled = {true}
      />

      <Input
        size="md"
        state="warning"
        label="Warning Input"
        placeholder="Warning input"
        helperText="This is a warning message"
        rightIcon={<AlertCircle />}
      />

      <Input
        state="error"
        label="Error Input"
        placeholder="Error input"
        error="This field is required"
        rightIcon={<AlertCircle />}
      />

      <Input
        disabled
        label="Disabled Input"
        placeholder="Disabled input"
        helperText="This input is disabled"
        leftIcon={<Search />}
      />
    </div>
  )
}


