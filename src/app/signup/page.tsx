'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { toast } from '@/components/Toast'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, signUp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      toast('Account created successfully!', 'success')
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!email || !password || !confirmPassword) {
      toast('Please fill in all fields', 'error')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      toast('Please enter a valid email address', 'error')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'error')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast('Password must be at least 6 characters', 'error')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      toast(error.message, 'error')
    } else {
      toast('Account created! Please check your email for verification.', 'success')
      // Note: Supabase may send verification email
      // For development, we redirect immediately
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-[color:var(--color-court-blue)]">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-spike-gold)]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password (min 6 characters)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-spike-gold)]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-spike-gold)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[color:var(--color-court-blue)] text-white rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[color:var(--color-court-blue)] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
