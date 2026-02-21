'use client'

import * as React from 'react'

export function useIsMobile(query = '(max-width: 768px)'): boolean {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    // Set the initial value
    setIsMobile(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return isMobile
}
