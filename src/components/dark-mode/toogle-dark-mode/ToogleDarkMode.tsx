'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export const ToogleDarkMode = () => {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-3 left-3 z-30"
        onClick={toggleTheme}
      >
        {theme === 'light'
          ? (
            <SunIcon />)
          : (
            <MoonIcon />)
        }
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  )
}
