export type Position = 'Setter' | 'Libero' | 'Outside Hitter' | 'Middle Blocker' | 'Opposite'

export interface Player {
  id: string
  name: string
  position: Position
  team: string
  spike_reach_cm: number
  block_reach_cm: number
  serve_aces: number
  kill_pct: number
  bio: string
  image_url: string
  created_at: string
}

export interface Lineup {
  id: string
  user_id: string
  lineup_name: string
  player_ids: string[]
  tactical_notes: string | null
  created_at: string
  updated_at: string
}
