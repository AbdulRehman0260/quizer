import React from 'react'

const QuizResultCard = ({data}) => {
  // Sort data by score in descending order (highest first)
  const sortedData = [...data].sort((a, b) => b.score - a.score)

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'from-amber-400 to-amber-500'
      case 1: return 'from-gray-300 to-gray-400'
      case 2: return 'from-orange-400 to-orange-500'
      default: return 'from-slate-100 to-slate-200'
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-4xl font-black text-center mb-1">🏆 Leaderboard</h2>
        <p className="text-center text-gray-500 text-sm">Top Players</p>
      </div>

      <div className="space-y-3">
        {sortedData.map((user, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              index === 0
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-lg'
                : index === 1
                ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200'
                : index === 2
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200'
                : 'bg-white border-2 border-gray-100 hover:border-blue-200'
            }`}
          >
            {/* Rank Badge */}
            <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center shadow-md`}>
              <span className="text-2xl font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
              </span>
              {index > 2 && <span className="text-lg font-bold text-gray-700">{index + 1}</span>}
            </div>

            {/* Player Info */}
            <div className="flex-grow">
              <p className={`font-bold text-lg ${
                index === 0 ? 'text-amber-900' : 'text-gray-800'
              }`}>
                {user.userName}
              </p>
              <p className="text-xs text-gray-500">
                {index === 0 && '👑 First Place'}
                {index === 1 && '⭐ Second Place'}
                {index === 2 && '✨ Third Place'}
                {index > 2 && `#${index + 1}`}
              </p>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right">
              <p className={`text-3xl font-black ${
                index === 0 ? 'text-amber-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {user.score}
              </p>
              <p className="text-xs text-gray-500 font-semibold">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizResultCard