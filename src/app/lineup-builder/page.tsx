'use client'

import { useState, useEffect } from 'react'
import { mockPlayers } from '@/data/mockPlayers'
import type { Player } from '@/types/database'

interface Lineup {
  id: string
  name: string
  playerIds: string[]
  tacticalNotes: string
}

export default function LineupBuilderPage() {
  const [lineupName, setLineupName] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [tacticalNotes, setTacticalNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedLineups, setSavedLineups] = useState<Lineup[]>([])
  const [showPlayerModal, setShowPlayerModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lineups')
    if (saved) {
      setSavedLineups(JSON.parse(saved))
    }
  }, [])

  const filteredPlayers = mockPlayers.filter(
    p => !selectedPlayers.some(sp => sp.id === p.id) && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     p.team.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const addPlayer = (player: Player) => {
    if (selectedPlayers.length < 6) {
      setSelectedPlayers([...selectedPlayers, player])
    }
    setShowPlayerModal(false)
    setSearchQuery('')
  }

  const removePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId))
  }

  const saveLineup = () => {
    if (!lineupName || selectedPlayers.length !== 6) return

    const newLineup: Lineup = {
      id: Date.now().toString(),
      name: lineupName,
      playerIds: selectedPlayers.map(p => p.id),
      tacticalNotes
    }

    const updatedLineups = [...savedLineups, newLineup]
    setSavedLineups(updatedLineups)
    localStorage.setItem('lineups', JSON.stringify(updatedLineups))
    
    setLineupName('')
    setSelectedPlayers([])
    setTacticalNotes('')
  }

  const deleteLineup = (id: string) => {
    const updatedLineups = savedLineups.filter(l => l.id !== id)
    setSavedLineups(updatedLineups)
    localStorage.setItem('lineups', JSON.stringify(updatedLineups))
  }

  const exportToCSV = (lineup: Lineup) => {
    const players = mockPlayers.filter(p => lineup.playerIds.includes(p.id))
    const csvContent = [
      ['Lineup Name:', lineup.name],
      ['Tactical Notes:', lineup.tacticalNotes],
      [],
      ['Player Name', 'Position', 'Team', 'Spike Reach (cm)', 'Kill %'],
      ...players.map(p => [
        p.name,
        p.position,
        p.team,
        p.spike_reach_cm,
        (p.kill_pct * 100).toFixed(1) + '%'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${lineup.name.replace(/\s+/g, '_')}_lineup.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const positions = ['Setter', 'Libero', 'Outside Hitter', 'Middle Blocker', 'Opposite']

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-[color:var(--color-court-blue)]">
          Custom Lineup Builder (View 5)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4">Build Your Lineup</h2>
            
            <div className="mb-4">
              <label htmlFor="lineupName" className="block text-sm font-medium mb-1">
                Lineup Name
              </label>
              <input
                id="lineupName"
                type="text"
                value={lineupName}
                onChange={(e) => setLineupName(e.target.value)}
                placeholder="Enter lineup name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Selected Players ({selectedPlayers.length}/6)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedPlayers.map(player => (
                  <div
                    key={player.id}
                    className="relative bg-gray-50 dark:bg-gray-700 rounded p-2 flex flex-col items-center"
                  >
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                    <img
                      src={player.image_url}
                      alt={player.name}
                      className="w-12 h-12 rounded object-cover mb-1"
                    />
                    <p className="text-xs font-medium truncate w-full text-center">{player.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{player.position}</p>
                  </div>
                ))}
                {selectedPlayers.length < 6 && (
                  <button
                    onClick={() => setShowPlayerModal(true)}
                    className="bg-gray-50 dark:bg-gray-700 rounded p-2 flex flex-col items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="tacticalNotes" className="block text-sm font-medium mb-1">
                Tactical Notes (Feature #23 - Personal Notes)
              </label>
              <textarea
                id="tacticalNotes"
                value={tacticalNotes}
                onChange={(e) => setTacticalNotes(e.target.value)}
                placeholder="Add your tactical strategies and notes..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 resize-none"
              />
            </div>

            <button
              onClick={saveLineup}
              disabled={!lineupName || selectedPlayers.length !== 6}
              className="w-full py-3 bg-[color:var(--color-court-blue)] text-white rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Save Lineup
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-4">Court Positions</h2>
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 300 150" className="w-full h-full">
                <rect x="0" y="0" width="300" height="150" fill="none" stroke="#666" strokeWidth="2" />
                <line x1="150" y1="0" x2="150" y2="150" stroke="#666" strokeWidth="1" />
                <text x="150" y="20" textAnchor="middle" className="text-xs fill-gray-600">Net</text>
                
                {selectedPlayers.map((player, index) => {
                  const positions = [
                    { x: 150, y: 30, label: 'Position 1' },
                    { x: 250, y: 75, label: 'Position 2' },
                    { x: 150, y: 120, label: 'Position 3' },
                    { x: 50, y: 75, label: 'Position 4' },
                    { x: 150, y: 60, label: 'Position 5' },
                    { x: 100, y: 100, label: 'Position 6' }
                  ]
                  const pos = positions[index]
                  return (
                    <g key={player.id}>
                      <circle cx={pos.x} cy={pos.y} r="15" fill="#0F4C81" />
                      <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="text-xs fill-white" >
                        {player.position[0]}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {showPlayerModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold">Select a player to add</h3>
                <button
                  onClick={() => setShowPlayerModal(false)}
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
                      onClick={() => addPlayer(player)}
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-[color:var(--color-court-blue)]">
            Saved Lineups
          </h2>
          {savedLineups.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No lineups saved yet.</p>
          ) : (
            <div className="space-y-4">
              {savedLineups.map(lineup => {
                const players = mockPlayers.filter(p => lineup.playerIds.includes(p.id))
                return (
                  <div
                    key={lineup.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{lineup.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{players.length} players</p>
                      </div>
                      <button
                        onClick={() => deleteLineup(lineup.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {lineup.tacticalNotes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{lineup.tacticalNotes}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {players.map(p => (
                        <span
                          key={p.id}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => exportToCSV(lineup)}
                      className="text-sm bg-[color:var(--color-spike-gold)] text-black px-3 py-1 rounded hover:opacity-90"
                    >
                      Export CSV (Feature #50)
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
