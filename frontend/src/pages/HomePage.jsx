import React, { useState, useEffect } from 'react'
import QuizQuestion from '../components/QuizQuestion'
import { ThreeDots } from 'react-loader-spinner'
import QuizResultCard from '../components/QuizResultCard'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''



const HomePage = () => {
  const [userNameInput, setUserNameInput] = useState('')
  const [userSaved, setUserSaved] = useState(false)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [userError, setUserError] = useState('')
  const [quizButtonClicked, setQuizButtonClicked] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionStarted, setQuestionStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [userScores, setUserScores] = useState([])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/questions/quizQuestions`)
        const data = await response.json()

        //set this temporarily to the state for now until we implement the backend just to see the componenet - Make sure to remove this later when we implement the backend
        setQuizQuestions(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching quiz questions:', error)
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    if (!userNameInput.trim()) return

    setIsSubmittingUser(true)
    setUserError('')

    //check if the username already exists in the backend if they dont then create them
    try {
      const response = await fetch(`${apiBaseUrl}/api/users/${userNameInput}`, {
        method: 'GET',
      })
      if (response.ok) {
        setUserSaved(true)
      } else {
        if (response.status === 404) {
          // User not found, create the user
          const createResponse = await fetch(`${apiBaseUrl}/api/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName: userNameInput }),
          })
          if (createResponse.ok) {
            setUserSaved(true)
          } else {
            setUserError('Failed to save username. Please try again.')
          }
        } else {
          setUserError('Failed to save username. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setUserError('Failed to save username. Please try again.')
    } finally {
      setIsSubmittingUser(false)
    }
  }


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

  useEffect(() => {
    if (quizStarted && !questionStarted) {
      const timerId = setTimeout(() => {
        setQuestionStarted(true)
      }, 1000)
      return () => clearTimeout(timerId)
    }
  }, [quizStarted, questionStarted])

  useEffect(() => {
    if (quizCompleted && userSaved) {
      const saveAndFetchScores = async () => {
        try {
          const scoreResponse = await fetch(`${apiBaseUrl}/api/scores`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName: userNameInput,
              score: score,
            }),
          })
          if (!scoreResponse.ok) {
            console.error('Failed to save score:', scoreResponse.statusText)
          }

          const allScoresResponse = await fetch(`${apiBaseUrl}/api/scores`)
          if (allScoresResponse.ok) {
            const allScoresData = await allScoresResponse.json()
            setUserScores(allScoresData)
            console.log('All scores:', allScoresData)
          } else {
            console.error('Failed to fetch all scores:', allScoresResponse.statusText)
          }
        } catch (error) {
          console.error('Error saving score:', error)
        }
      }

      saveAndFetchScores()
    }
  }, [quizCompleted, userSaved, userNameInput, score])

  const handleAnswer = (selectedOption) => {
    const currentQuestion = quizQuestions[currentQuestionIndex]
    
    if (selectedOption === currentQuestion.answer) {
      setScore(prevScore => prevScore + 1)
    }

    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= quizQuestions.length) {
      setQuizCompleted(true)
      setQuizStarted(false)
      setQuestionStarted(false)
    } else {
      setCurrentQuestionIndex(nextIndex)
      setQuestionNumber(nextIndex + 1)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {!userSaved ? (
        <div className='w-full max-w-md px-4'>
          <div className='bg-white rounded-2xl shadow-md p-8 md:p-10 border border-blue-100'>
            {/* Header */}
            <div className='mb-8'>
              <div className='text-5xl mb-4'>🧠</div>
              <h1 className='text-4xl md:text-5xl font-black text-gray-900 mb-2'>
                Brain Bytes
              </h1>
              <p className='text-lg text-blue-600 font-medium'>
                Challenge Your Knowledge
              </p>
            </div>

            {/* Description */}
            <p className='text-center text-gray-700 mb-8 leading-relaxed'>
              Get ready to test your general knowledge with our exciting quiz! 
              <span className='block mt-2 text-sm text-gray-600'>
                Answer 15 questions and see how you rank on the leaderboard.
              </span>
            </p>

            {/* Form */}
            <form onSubmit={handleUserSubmit} className='flex flex-col gap-5'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Enter your username'
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className='w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 text-gray-800 placeholder-gray-400'
                  disabled={isSubmittingUser}
                  required
                  maxLength={20}
                />
                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500'>
                  {userNameInput.length}/20
                </span>
              </div>

              <button
                type='submit'
                disabled={isSubmittingUser || !userNameInput.trim()}
                className='w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {isSubmittingUser ? (
                  <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Starting...
                  </span>
                ) : (
                  <span className='flex items-center justify-center gap-2'>
                    Start Quiz →
                  </span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {userError && (
              <div className='mt-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg'>
                <p className='text-red-700 text-sm font-medium'>⚠️ {userError}</p>
              </div>
            )}

            {/* Footer Info */}
            <div className='mt-8 pt-6 border-t border-gray-100'>
              <p className='text-xs text-gray-500 text-center'>
                ✓ 15 Questions  •  ✓ Multiple Choice  •  ✓ Real-time Results
              </p>
            </div>
          </div>
        </div>
      ) : quizCompleted ? (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4 text-green-700'>Quiz Completed, {userNameInput}!</h1>
          <h2 className='text-2xl font-bold mb-10'>Final Score: {score}</h2>
          <QuizResultCard data={userScores} />

          <button
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer'
            onClick={() => {
              setQuizButtonClicked(false)
              setCountdown(3)
              setQuizStarted(false)
              setQuestionStarted(false)
              setCurrentQuestionIndex(0)
              setScore(0)
              setQuizCompleted(false)
              setQuestionNumber(1)
            }}
          >
            Restart Quiz
          </button>
        </div>
      ) : isLoading ? (
        <div className='text-center'>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            wrapperStyle={{ margin: '20px' }}
            wrapperClass="custom-loader"
            visible={true}
          />
        </div>
      ) : quizStarted && questionStarted ? (
        <>
          <div className='text-center mb-4'>
            <h2 className='text-2xl font-bold mb-10'>
              Player: {userNameInput} | Score: {score} | Question: {questionNumber} of {quizQuestions.length}
            </h2>
          </div>
          <QuizQuestion
            key={currentQuestionIndex}
            quizBank={quizQuestions[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
        </>
      ) : quizButtonClicked && !quizStarted ? (
        <div className='text-center'>
          <h1 className='text-8xl font-bold mb-4 text-red-700'>{countdown}</h1>
        </div>
      ) : quizStarted && !questionStarted ? (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4 text-green-700'>Quiz Started!</h1>
        </div>
      ) : (
        <>
          <h1 className='text-4xl font-bold mb-4'>General Specific Quiz</h1>
          <p className='text-lg text-gray-700 mb-2'>Welcome, <span className='font-semibold'>{userNameInput}</span>!</p>
          <p className='text-gray-600'>Test your general and specific knowledge.</p>
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