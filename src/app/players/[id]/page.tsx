'use client'

import Link from 'next/link'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { mockPlayers } from '@/data/mockPlayers'
import type { Player } from '@/types/database'

export default function PlayerDetailPage({ params }: { params: { id: string } }) {
  const player = mockPlayers.find(p => p.id === params.id)

  if (!player) {
    notFound()
  }

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['bio']))

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  const isExpanded = (section: string) => expandedSections.has(section)

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-8">
              <img
                src={player.image_url}
                alt={player.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{player.name}</h2>
                <p className="text-[color:var(--color-spike-gold)] font-medium">{player.position}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{player.team}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold mb-6">{player.name}</h2>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-court-blue)]">
                  Physical Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Spike Reach</p>
                    <p className="text-2xl font-bold">{player.spike_reach_cm}<span className="text-sm font-normal">cm</span></p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Block Reach</p>
                    <p className="text-2xl font-bold">{player.block_reach_cm}<span className="text-sm font-normal">cm</span></p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-court-blue)]">
                  Performance Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kill Percentage</p>
                    <p className="text-2xl font-bold">{(player.kill_pct * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Serve Aces</p>
                    <p className="text-2xl font-bold">{player.serve_aces}</p>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-court-blue)]">
                  Team Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="font-medium">{player.team}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current Team</p>
                </div>
              </section>

              <section className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-600 mb-4">
                  <button
                    onClick={() => toggleSection('bio')}
                    className="flex justify-between items-center w-full py-2 text-left"
                  >
                    <h3 className="text-lg font-semibold text-[color:var(--color-court-blue)]">
                      Biography (Feature #24 - Expandable)
                    </h3>
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded('bio') ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {isExpanded('bio') && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">{player.bio}</p>
                  </div>
                )}
              </section>

              <section>
                <div className="border-b border-gray-200 dark:border-gray-600 mb-4">
                  <button
                    onClick={() => toggleSection('stats')}
                    className="flex justify-between items-center w-full py-2 text-left"
                  >
                    <h3 className="text-lg font-semibold text-[color:var(--color-court-blue)]">
                      Detailed Statistics (Feature #24 - Expandable)
                    </h3>
                    <svg
                      className={`w-5 h-5 transition-transform ${isExpanded('stats') ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {isExpanded('stats') && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Spike Reach</span>
                      <span>{player.spike_reach_cm} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Block Reach</span>
                      <span>{player.block_reach_cm} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kill Percentage</span>
                      <span>{(player.kill_pct * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Serve Aces</span>
                      <span>{player.serve_aces}</span>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/players"
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Players
          </Link>
        </div>
      </div>
    </main>
  )
}
