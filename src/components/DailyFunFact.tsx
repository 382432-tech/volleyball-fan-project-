'use client'

import { useState } from 'react'

const funFacts = [
  "The fastest recorded volleyball serve is 132 km/h (82 mph) by Wilfredo León.",
  "Volleyball was invented in 1895 by William G. Morgan in Holyoke, Massachusetts.",
  "The libero position was introduced in 1996 and wears a different colored jersey.",
  "A volleyball match is played best of 5 sets, with each set played to 25 points.",
  "The FIVB World League is the longest and richest of all international volleyball events.",
  "Beach volleyball became an Olympic sport in 1996.",
  "The tallest volleyball player ever was Robertlandy Simón at 2.06m (6'9\").",
  "A volleyball court is 18 meters long and 9 meters wide.",
  "The net height for men is 2.43 meters (7'11\") and for women is 2.24 meters (7'4\").",
  "The first volleyball world championship was held in 1949."
]

export default function DailyFunFact() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const nextFact = () => {
    setCurrentFactIndex(prev => (prev + 1) % funFacts.length)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-court-blue)]">
        Daily Fun Fact (Feature #33)
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{funFacts[currentFactIndex]}</p>
      <button
        onClick={nextFact}
        className="px-4 py-2 bg-[color:var(--color-spike-gold)] text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        Next Fact
      </button>
    </div>
  )
}
