-- Spike Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean existing tables for re-runs
DROP TABLE IF EXISTS public.lineups CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;

-- 1. PLAYERS TABLE (Read-Only Global Dictionary)
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('Setter', 'Libero', 'Outside Hitter', 'Middle Blocker', 'Opposite')),
    team TEXT NOT NULL,
    spike_reach_cm INTEGER NOT NULL CHECK (spike_reach_cm > 0),
    block_reach_cm INTEGER NOT NULL CHECK (block_reach_cm > 0),
    serve_aces INTEGER NOT NULL DEFAULT 0 CHECK (serve_aces >= 0),
    kill_pct NUMERIC(4, 3) NOT NULL CHECK (kill_pct >= 0.000 AND kill_pct <= 1.000),
    bio TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. LINEUPS TABLE (User CRUD Entity)
CREATE TABLE public.lineups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lineup_name TEXT NOT NULL CHECK (char_length(trim(lineup_name)) > 0),
    player_ids UUID[] NOT NULL CHECK (array_length(player_ids, 1) = 6),
    tactical_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lineups_user_id ON public.lineups(user_id);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineups ENABLE ROW LEVEL SECURITY;

-- Players read policy
CREATE POLICY "Allow public read access on players"
    ON public.players FOR SELECT TO public USING (true);

-- Lineups owner policies
CREATE POLICY "Users can view their own lineups"
    ON public.lineups FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lineups"
    ON public.lineups FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lineups"
    ON public.lineups FOR UPDATE TO authenticated
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lineups"
    ON public.lineups FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 4. INITIAL SEED DATA (8 Players)
INSERT INTO public.players (id, name, position, team, spike_reach_cm, block_reach_cm, serve_aces, kill_pct, bio, image_url) VALUES 
('a1b2c3d4-0001-4000-8000-000000000001', 'Yuji Nishida', 'Opposite', 'Panasonic Panthers (JPN)', 350, 335, 142, 0.525, 'Explosive Japanese opposite hitter renowned for his vertical leap and left-handed jump serve.', 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0002-4000-8000-000000000002', 'Ran Takahashi', 'Outside Hitter', 'Vero Volley Monza (ITA)', 343, 315, 85, 0.482, 'Versatile outside hitter praised for defense, serve receive stability, and quick pipe attacks.', 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0003-4000-8000-000000000003', 'Wilfredo León', 'Outside Hitter', 'Bogdanka LUK Lublin (POL)', 370, 346, 210, 0.560, 'One of the most powerful hitters in volleyball history, holding serve velocity world records.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0004-4000-8000-000000000004', 'Luciano De Cecco', 'Setter', 'Cucine Lube Civitanova (ITA)', 332, 317, 64, 0.410, 'Master Argentine playmaker recognized for setting distribution and leadership under pressure.', 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0005-4000-8000-000000000005', 'Jenia Grebennikov', 'Libero', 'Zenit Saint Petersburg (RUS)', 305, 290, 0, 0.000, 'Premier defensive specialist distinguished by fast reaction times and court coverage.', 'https://images.unsplash.com/photo-1547347298-1d748505882f?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0006-4000-8000-000000000006', 'Robertlandy Simón', 'Middle Blocker', 'Gas Sales Piacenza (ITA)', 384, 350, 175, 0.635, 'Dominant middle blocker featuring unmatched height, lateral block speed, and heavy attack angles.', 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0007-4000-8000-000000000007', 'Paola Egonu', 'Opposite', 'Vero Volley Milano (ITA)', 344, 321, 130, 0.518, 'Elite scoring opposite who dominates international play with high contact points and clutch execution.', 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80'),
('a1b2c3d4-0008-4000-8000-000000000008', 'Antoine Brizard', 'Setter', 'Gas Sales Piacenza (ITA)', 340, 325, 92, 0.445, 'Olympic gold medalist setter known for physical blocking capability and offense distribution.', 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80');
