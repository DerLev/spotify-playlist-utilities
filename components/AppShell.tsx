import React, { ReactNode } from 'react'
import { AppShell, Header, Text, Flex } from '@mantine/core'
import { FaSpotify } from 'react-icons/fa'

interface AppShellProps {
  children: ReactNode
}

const AppShellComp = ({ children }: AppShellProps) => (
  <AppShell
    padding={'md'}
    header={
      <Header height={60} p={'xs'}>
        <Flex align={'center'} gap={'sm'} h={'100%'}>
          <FaSpotify size={'2rem'} color='#1ed760' />
          <Text
            span
            size={'1.625rem'}
            sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          >
            Spotify Playlist Utilities
          </Text>
        </Flex>
      </Header>
    }
    styles={(theme) => ({
      main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    { children }
  </AppShell>
)

export default AppShellComp
