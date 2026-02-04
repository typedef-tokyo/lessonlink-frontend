import type { Metadata } from 'next'
import './globals.css'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'
import { UserProvider } from '../context/UserContext'
import { queryClient } from './lib/zodios'
import { MuiProvider } from './providers/MuiProvider'

export const metadata: Metadata = {
  title: 'LessonLink',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const mantineTheme = createTheme({})

  return (
    <html lang='ja'>
      <body>
        <MantineProvider theme={mantineTheme} forceColorScheme='light'>
          <MuiProvider>
            <Notifications position='top-center' />
            <ModalsProvider>
              <QueryClientProvider client={queryClient}>
                <UserProvider>
                  <style>
                    {`
                  @media print {
                    .print-container {
                      height: auto;
                      overflow: visible !important;
                    }
                  }
                `}
                  </style>
                  <div className='flex flex-col h-screen overflow-hidden print-container'>
                    <main className='h-full w-full flex flex-col'>{children}</main>
                  </div>
                </UserProvider>
              </QueryClientProvider>
            </ModalsProvider>
          </MuiProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
