'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { getPlayers } from '@/lib/supabase/queries'
import type { Player, Position } from '@/types/database'
import { mockPlayers } from '@/data/mockPlayers'

type SortOption = 'name-asc' | 'spike-desc' | 'kill-desc'

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers()
        if (data.length > 0) {
          setPlayers(data)
        } else {
          // Fallback to mock data if database is empty
          setPlayers(mockPlayers)
        }
      } catch (err) {
        console.error('Error fetching players:', err)
        setError('Failed to load players. Using mock data.')
        setPlayers(mockPlayers)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  const positions: Position[] = ['Setter', 'Libero', 'Outside Hitter', 'Middle Blocker', 'Opposite']

  const filteredPlayers = useMemo(() => {
    let result = players

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || p.team.toLowerCase().includes(query)
      )
    }

    if (selectedPosition) {
      result = result.filter(p => p.position === selectedPosition)
    }

    switch (sortBy) {
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'spike-desc':
        result = [...result].sort((a, b) => b.spike_reach_cm - a.spike_reach_cm)
        break
      case 'kill-desc':
        result = [...result].sort((a, b) => b.kill_pct - a.kill_pct)
        break
    }

    return result
  }, [players, searchQuery, selectedPosition, sortBy])

  const toggleFavorite = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(playerId)) {
      newFavorites.delete(playerId)
    } else {
      newFavorites.add(playerId)
    }
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
  }

  const isFavorite = (playerId: string) => favorites.has(playerId)

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-8">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading players...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        {error && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Find Players</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium mb-1">
                  Search Players (Feature #1)
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name or team..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label htmlFor="sort" className="block text-sm font-medium mb-1">
                  Sort By (Feature #3)
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="spike-desc">Spike Reach (High to Low)</option>
                  <option value="kill-desc">Kill Percentage (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Filter by Position (Feature #2)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPosition(null)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedPosition === null ? 'bg-[color:var(--color-spike-gold)] text-black' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  All
                </button>
                {positions.map(pos => (
                  <button
                    key={pos}
                    onClick={() => setSelectedPosition(pos)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedPosition === pos ? 'bg-[color:var(--color-spike-gold)] text-black' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Showing {filteredPlayers.length} of {players.length} players
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPlayers.map(player => (
              <Link
                key={player.id}
                href={`/players/${player.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                  <img
                    src={player.image_url}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(e, player.id)}
                    className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full p-1.5 hover:bg-white"
                    title={isFavorite(player.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill={isFavorite(player.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{player.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{player.position}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{player.team}</p>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Spike Reach</span>
                      <span className="font-medium">{player.spike_reach_cm} cm</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500 dark:text-gray-400">Kill %</span>
                      <span className="font-medium">{(player.kill_pct * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500 dark:text-gray-400">Serve Aces</span>
                      <span className="font-medium">{player.serve_aces}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No players found matching your criteria.
            </div>
          )}
        </div>
      </main>
    )
}
