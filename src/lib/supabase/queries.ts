import { supabase } from './client'
import type { Player, Lineup } from '@/types/database'

// Fetch all players
export async function getPlayers(): Promise<Player[]> {
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
