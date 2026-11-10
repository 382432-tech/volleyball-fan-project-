import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="bg-[color:var(--color-court-blue)] text-white p-4">
        <h1 className="text-2xl font-bold">Spike Hub</h1>
        <p className="text-sm opacity-90">Volleyball Stats & Lineups</p>
      </header>
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome to Spike Hub</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your platform for volleyball player stats, comparisons, and custom lineup building.
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/players"
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-[color:var(--color-court-blue)] mb-2">Player Directory</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Browse and search volleyball players with detailed stats
              </p>
              <div className="h-2 w-full bg-[color:var(--color-spike-gold)] rounded opacity-30"></div>
            </Link>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-[color:var(--color-court-blue)] mb-2">Head-to-Head</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Compare players side-by-side with visual metrics
              </p>
              <div className="h-2 w-full bg-[color:var(--color-spike-gold)] rounded opacity-30"></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-[color:var(--color-court-blue)] mb-2">Lineup Builder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Build and save custom 6-player rotations
              </p>
              <div className="h-2 w-full bg-[color:var(--color-spike-gold)] rounded opacity-30"></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Spike Hub - Volleyball Fan Project
      </footer>
    </div>
  );
}
