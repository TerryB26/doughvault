
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function Home() {
  try {
    const { userId } = await auth()

    if (userId) {
      redirect('/dashboard')
    }
  } catch (error) {
    console.error('Auth check failed on homepage:', error)
    // Continue to render HomeClient even if auth check fails
  }

  return <HomeClient />
}
