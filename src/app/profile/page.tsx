'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getLineups, getPlayers } from '@/lib/supabase/queries'
import { toast } from '@/components/Toast'
import Link from 'next/link'
import type { Lineup, Player } from '@/types/database'
import { mockPlayers } from '@/data/mockPlayers'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [lineups, setLineups] = useState<Lineup[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      toast('Please sign in to view your profile', 'error')
      router.push('/login')
      return
    }
    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch players
      const playerData = await getPlayers()
      if (playerData.length > 0) {
        setPlayers(playerData)
      } else {
        setPlayers(mockPlayers)
      }

      // Fetch lineups for current user
      if (user) {
        const lineupData = await getLineups(user.id)
        setLineups(lineupData)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      toast('Failed to load your data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getPlayerCount = (lineup: Lineup) => {
    return lineup.player_ids.length
  }

  const getLineupPlayers = (lineup: Lineup) => {
    return players.filter(p => lineup.player_ids.includes(p.id))
  }

  const handleSignOut = async () => {
    await signOut()
    toast('Signed out successfully', 'success')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-8">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[color:var(--color-court-blue)]">
            Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and view your saved lineups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-[color:var(--color-court-blue)]">
              Account Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Lineups</p>
                <p className="font-medium">{lineups.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-[color:var(--color-court-blue)]">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/lineup-builder"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-[color:var(--color-court-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Lineup</span>
              </Link>
              <Link
                href="/players"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-[color:var(--color-court-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Browse Players</span>
              </Link>
              <Link
                href="/compare"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-[color:var(--color-court-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Compare Players</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6 text-[color:var(--color-court-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4 text-[color:var(--color-court-blue)]">
            Your Lineups
          </h2>
          
          {lineups.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>You haven't created any lineups yet.</p>
              <Link
                href="/lineup-builder"
                className="mt-4 inline-block px-4 py-2 bg-[color:var(--color-court-blue)] text-white rounded-lg hover:bg-opacity-90 transition-opacity"
              >
                Create Your First Lineup
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {lineups.map(lineup => {
                const lineupPlayers = getLineupPlayers(lineup)
                return (
                  <Link
                    key={lineup.id}
                    href={`/lineup-builder?lineup=${lineup.id}`}
                    className="block bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{lineup.lineup_name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getPlayerCount(lineup)} players
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {lineup.tactical_notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {lineup.tactical_notes}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {lineupPlayers.slice(0, 4).map(p => (
                        <span
                          key={p.id}
                          className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs"
                        >
                          {p.name}
                        </span>
                      ))}
                      {lineupPlayers.length > 4 && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                          +{lineupPlayers.length - 4} more
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
