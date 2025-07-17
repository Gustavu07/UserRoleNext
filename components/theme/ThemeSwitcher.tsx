"use client";

import { Button } from "@heroui/react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
      The current theme is: {theme}
      <Button 
        onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        color="success"
      >
        Toggle Theme
      </Button>
    </div>
  )
};