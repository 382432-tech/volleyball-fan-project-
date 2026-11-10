'use client'

import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()

  return (
    <header className="bg-[color:var(--color-court-blue)] text-white p-4 flex justify-between items-center">
      <div>
        <Link href="/" className="text-2xl font-bold hover:opacity-90">Spike Hub</Link>
        <p className="text-sm opacity-90">Volleyball Stats & Lineups</p>
      </div>
      
      <nav className="flex items-center gap-4">
        <Link href="/players" className="hover:opacity-90 transition-opacity">Players</Link>
        <Link href="/compare" className="hover:opacity-90 transition-opacity">Compare</Link>
        {user && (
          <>
            <Link href="/lineup-builder" className="hover:opacity-90 transition-opacity">Lineup Builder</Link>
            <Link href="/profile" className="hover:opacity-90 transition-opacity">Profile</Link>
          </>
        )}
        
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{user.email}</span>
            <button
              onClick={signOut}
              className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  )
}
