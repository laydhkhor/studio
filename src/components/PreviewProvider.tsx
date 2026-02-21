'use client'
import {LiveQueryProvider} from 'next-sanity/preview'
import {client} from '@/sanity/client'

// eslint-disable-next-line
export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  return <LiveQueryProvider client={client} token={token}>{children}</LiveQueryProvider>
}
