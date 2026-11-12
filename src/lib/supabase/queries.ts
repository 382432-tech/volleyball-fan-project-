import { supabase } from './client'
import { mockPlayers } from '@/data/mockPlayers'
import type { Player, Lineup } from '@/types/database'

const MOCK_LINEUPS_KEY = 'spike_hub_mock_lineups'
let memoryLineups: Lineup[] = []

function readMockLineups(): Lineup[] {
  if (typeof window === 'undefined') return memoryLineups
  try {
    const raw = window.localStorage.getItem(MOCK_LINEUPS_KEY)
    return raw ? (JSON.parse(raw) as Lineup[]) : memoryLineups
  } catch {
    return memoryLineups
  }
}

function writeMockLineups(lineups: Lineup[]) {
  memoryLineups = lineups
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MOCK_LINEUPS_KEY, JSON.stringify(lineups))
    } catch {
      // Ignore storage quota errors
    }
  }
}

// Fetch all players
export async function getPlayers(): Promise<Player[]> {
  if (!supabase) {
    return [...mockPlayers].sort((a, b) => a.name.localeCompare(b.name))
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching players:', error)
    return []
  }
  return data
}

// Fetch a single player by ID
export async function getPlayerById(id: string): Promise<Player | null> {
  if (!supabase) {
    return mockPlayers.find(p => p.id === id) ?? null
  }

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching player:', error)
    return null
  }
  return data
}

// Fetch lineups for current user
export async function getLineups(userId: string): Promise<Lineup[]> {
  if (!supabase) {
    return readMockLineups()
      .filter(l => l.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  const { data, error } = await supabase
    .from('lineups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching lineups:', error)
    return []
  }
  return data
}

// Create a new lineup
export async function createLineup(lineup: Omit<Lineup, 'id' | 'created_at' | 'updated_at'>): Promise<Lineup | null> {
  if (!supabase) {
    const now = new Date().toISOString()
    const created: Lineup = {
      ...lineup,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lineup-${Date.now()}`,
      created_at: now,
      updated_at: now,
    }
    const existing = readMockLineups()
    writeMockLineups([created, ...existing])
    return created
  }

  const { data, error } = await supabase
    .from('lineups')
    .insert([lineup])
    .select()
    .single()

  if (error) {
    console.error('Error creating lineup:', error)
    return null
  }
  return data
}

// Update a lineup
export async function updateLineup(id: string, updates: Partial<Lineup>): Promise<Lineup | null> {
  if (!supabase) {
    const existing = readMockLineups()
    const index = existing.findIndex(l => l.id === id)
    if (index === -1) return null
    const updated: Lineup = {
      ...existing[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    existing[index] = updated
    writeMockLineups(existing)
    return updated
  }

  const { data, error } = await supabase
    .from('lineups')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lineup:', error)
    return null
  }
  return data
}

// Delete a lineup
export async function deleteLineup(id: string): Promise<boolean> {
  if (!supabase) {
    const existing = readMockLineups()
    writeMockLineups(existing.filter(l => l.id !== id))
    return true
  }

  const { error } = await supabase
    .from('lineups')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lineup:', error)
    return false
  }
  return true
}

