import type { Player } from '@/types/database'

export const mockPlayers: Player[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    name: 'Yuji Nishida',
    position: 'Opposite',
    team: 'Panasonic Panthers (JPN)',
    spike_reach_cm: 350,
    block_reach_cm: 335,
    serve_aces: 142,
    kill_pct: 0.525,
    bio: 'Explosive Japanese opposite hitter renowned for his vertical leap and left-handed jump serve.',
    image_url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    name: 'Ran Takahashi',
    position: 'Outside Hitter',
    team: 'Vero Volley Monza (ITA)',
    spike_reach_cm: 343,
    block_reach_cm: 315,
    serve_aces: 85,
    kill_pct: 0.482,
    bio: 'Versatile outside hitter praised for defense, serve receive stability, and quick pipe attacks.',
    image_url: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    name: 'Wilfredo León',
    position: 'Outside Hitter',
    team: 'Bogdanka LUK Lublin (POL)',
    spike_reach_cm: 370,
    block_reach_cm: 346,
    serve_aces: 210,
    kill_pct: 0.560,
    bio: 'One of the most powerful hitters in volleyball history, holding serve velocity world records.',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    name: 'Luciano De Cecco',
    position: 'Setter',
    team: 'Cucine Lube Civitanova (ITA)',
    spike_reach_cm: 332,
    block_reach_cm: 317,
    serve_aces: 64,
    kill_pct: 0.410,
    bio: 'Master Argentine playmaker recognized for setting distribution and leadership under pressure.',
    image_url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    name: 'Jenia Grebennikov',
    position: 'Libero',
    team: 'Zenit Saint Petersburg (RUS)',
    spike_reach_cm: 305,
    block_reach_cm: 290,
    serve_aces: 0,
    kill_pct: 0.000,
    bio: 'Premier defensive specialist distinguished by fast reaction times and court coverage.',
    image_url: 'https://images.unsplash.com/photo-1547347298-1d748505882f?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0006-4000-8000-000000000006',
    name: 'Robertlandy Simón',
    position: 'Middle Blocker',
    team: 'Gas Sales Piacenza (ITA)',
    spike_reach_cm: 384,
    block_reach_cm: 350,
    serve_aces: 175,
    kill_pct: 0.635,
    bio: 'Dominant middle blocker featuring unmatched height, lateral block speed, and heavy attack angles.',
    image_url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0007-4000-8000-000000000007',
    name: 'Paola Egonu',
    position: 'Opposite',
    team: 'Vero Volley Milano (ITA)',
    spike_reach_cm: 344,
    block_reach_cm: 321,
    serve_aces: 130,
    kill_pct: 0.518,
    bio: 'Elite scoring opposite who dominates international play with high contact points and clutch execution.',
    image_url: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'a1b2c3d4-0008-4000-8000-000000000008',
    name: 'Antoine Brizard',
    position: 'Setter',
    team: 'Gas Sales Piacenza (ITA)',
    spike_reach_cm: 340,
    block_reach_cm: 325,
    serve_aces: 92,
    kill_pct: 0.445,
    bio: 'Olympic gold medalist setter known for physical blocking capability and offense distribution.',
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString()
  }
]
