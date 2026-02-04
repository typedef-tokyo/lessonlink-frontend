'use client'

import { ROUTES } from '@constants/Constants'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    location.href = ROUTES.LOGIN
  })

  return <></>
}
