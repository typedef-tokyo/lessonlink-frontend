'use client'
import { usePathname } from 'next/navigation'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { apiHooks } from '@/app/lib/zodios'

export type User = {
  id: number
  name: string
  userName: string
  roleKey: string
}

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  const {
    data: self,
    error,
    isLoading,
  } = apiHooks.useGetUserself(undefined, {
    enabled: !isLoginPage && user === null,
  })

  useEffect(() => {
    if (!isLoading && !error && self && !user) {
      setUser({
        id: self.id,
        name: self.name,
        userName: self.user_name,
        roleKey: self.role_key,
      })
    }
  }, [self, error, isLoading, user])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
