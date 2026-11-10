'use client'

import { useState, useMemo } from 'react'
import { mockPlayers } from '@/data/mockPlayers'
import type { Player } from '@/types/database'

export default function ComparePage() {
  const [player1, setPlayer1] = useState<Player | null>(null)
  const [player2, setPlayer2] = useState<Player | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectingFor, setSelectingFor] = useState<'player1' | 'player2' | null>(null)

  const filteredPlayers = useMemo(() => {
    if (!searchQuery) return mockPlayers
    const query = searchQuery.toLowerCase()
    return mockPlayers.filter(
      p => p.name.toLowerCase().includes(query) || p.team.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const selectPlayer = (player: Player) => {
    if (selectingFor === 'player1') {
      setPlayer1(player)
    } else if (selectingFor === 'player2') {
      setPlayer2(player)
    }
    setSelectingFor(null)
    setSearchQuery('')
  }

  const removePlayer = (which: 'player1' | 'player2') => {
    if (which === 'player1') setPlayer1(null)
    else setPlayer2(null)
  }

  const canCompare = player1 && player2

  const calculateDifference = (value1: number, value2: number) => {
    return value1 - value2
  }

  const getDifferenceColor = (diff: number) => {
    if (diff > 0) return 'text-green-600 dark:text-green-400'
    if (diff < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-[color:var(--color-court-blue)]">
          Head-to-Head Comparison (Feature #20)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold mb-4">Player 1</h2>
            {player1 ? (
              <div className="flex items-center gap-4">
                <img
                  src={player1.image_url}
                  alt={player1.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{player1.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{player1.position} - {player1.team}</p>
                </div>
                <button
                  onClick={() => removePlayer('player1')}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectingFor('player1')
                  setSearchQuery('')
                }}
                className="w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[color:var(--color-spike-gold)] transition-colors text-gray-500 dark:text-gray-400"
              >
                + Select Player 1
              </button>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold mb-4">Player 2</h2>
            {player2 ? (
              <div className="flex items-center gap-4">
                <img
                  src={player2.image_url}
                  alt={player2.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{player2.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{player2.position} - {player2.team}</p>
                </div>
                <button
                  onClick={() => removePlayer('player2')}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectingFor('player2')
                  setSearchQuery('')
                }}
                className="w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[color:var(--color-spike-gold)] transition-colors text-gray-500 dark:text-gray-400"
              >
                + Select Player 2
              </button>
            )}
          </div>
        </div>

        {selectingFor && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold">Select a player for {selectingFor === 'player1' ? 'Player 1' : 'Player 2'}</h3>
                <button
                  onClick={() => setSelectingFor(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {filteredPlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => selectPlayer(player)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                    >
                      <img
                        src={player.image_url}
                        alt={player.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{player.position} - {player.team}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {canCompare && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold mb-6 text-[color:var(--color-court-blue)]">
              Comparison Results
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Spike Reach</span>
                <span className="text-center">{player1!.spike_reach_cm} cm</span>
                <span className={`text-center ${getDifferenceColor(calculateDifference(player1!.spike_reach_cm, player2!.spike_reach_cm))}`}>
                  {calculateDifference(player1!.spike_reach_cm, player2!.spike_reach_cm)} cm
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[color:var(--color-spike-gold)] h-2 rounded-full"
                  style={{
                    width: `${(player1!.spike_reach_cm / (player1!.spike_reach_cm + player2!.spike_reach_cm)) * 100}%`
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Block Reach</span>
                <span className="text-center">{player1!.block_reach_cm} cm</span>
                <span className={`text-center ${getDifferenceColor(calculateDifference(player1!.block_reach_cm, player2!.block_reach_cm))}`}>
                  {calculateDifference(player1!.block_reach_cm, player2!.block_reach_cm)} cm
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[color:var(--color-spike-gold)] h-2 rounded-full"
                  style={{
                    width: `${(player1!.block_reach_cm / (player1!.block_reach_cm + player2!.block_reach_cm)) * 100}%`
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Kill Percentage</span>
                <span className="text-center">{(player1!.kill_pct * 100).toFixed(1)}%</span>
                <span className={`text-center ${getDifferenceColor(calculateDifference(player1!.kill_pct, player2!.kill_pct))}`}>
                  {calculateDifference(player1!.kill_pct, player2!.kill_pct).toFixed(3)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[color:var(--color-spike-gold)] h-2 rounded-full"
                  style={{
                    width: `${(player1!.kill_pct / (player1!.kill_pct + player2!.kill_pct)) * 100}%`
                  }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">Serve Aces</span>
                <span className="text-center">{player1!.serve_aces}</span>
                <span className={`text-center ${getDifferenceColor(calculateDifference(player1!.serve_aces, player2!.serve_aces))}`}>
                  {calculateDifference(player1!.serve_aces, player2!.serve_aces)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[color:var(--color-spike-gold)] h-2 rounded-full"
                  style={{
                    width: `${(player1!.serve_aces / (player1!.serve_aces + player2!.serve_aces)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {!canCompare && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Select two players to compare their stats side-by-side.
          </div>
        )}
      </div>
    </main>
  )
}
