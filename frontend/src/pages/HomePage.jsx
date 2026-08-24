import React from 'react'
import {useState, useEffect} from 'react'

const HomePage = () => {
  const [quizButtonClicked, setQuizButtonClicked] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    if (!quizButtonClicked || countdown <= 0) return
    const timerId = setTimeout(() => {
      setCountdown(prevCountdown => prevCountdown - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [quizButtonClicked, countdown])

  useEffect(() => {
    if (countdown === 0) {
      setQuizStarted(true)
    }
  }, [countdown])

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      {quizButtonClicked && !quizStarted ? (
        <div className='text-center'>
          <h1 className='text-8xl font-bold mb-4 text-red-700'>{countdown}</h1>
          {/* Add any additional content or functionality for the quiz here */}
        </div>
      
      ) : quizStarted ? (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4 text-green-700'>Quiz Started!</h1>
          {/* Add your quiz component or logic here */}
        </div>
      ) : (
        <>
          <h1 className='text-4xl font-bold mb-4'>General Specific Quiz</h1>
          <p className='text-lg text-gray-700'>Test your general and specific knowledge.</p>
          <div>
            <button
              className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer'
              onClick={() => setQuizButtonClicked(true)}
            >
              Start Quiz
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage