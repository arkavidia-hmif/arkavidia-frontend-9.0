"use client";
import React, { useState } from 'react'
import { Toggle } from './components/Toggle'

function Home() {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked); 
  };

  return (
    <div className="flex h-full w-full items-center justify-center dark:bg-black">
      <div className="pt-4 text-center dark:bg-black">
        <h1 className="text-4xl font-bold dark:text-white">Coming Soon!</h1>
        <div className="text-md mb-1 dark:text-white">In development</div>
        <p className="mt-2 text-sm dark:text-white">- by Arkavidia 9.0 IT Team</p>
        <Toggle
          label="Placeholder"
          checked={isChecked}
          onChange={handleToggleChange}
          labelPosition="right"
          disabled={false}
        />
      </div>
    </div>
  )
}

export default Home