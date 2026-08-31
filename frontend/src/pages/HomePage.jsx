import React, { useState, useEffect } from 'react'
import QuizQuestion from '../components/QuizQuestion'
import { ThreeDots } from 'react-loader-spinner'

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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/questions/quizQuestions')
        const data = await response.json()
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

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: userNameInput.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      setUserSaved(true)
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
    <div className='flex flex-col items-center justify-center h-screen'>
      {!userSaved ? (
        <div className='text-center max-w-md px-4'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to the General Specific Quiz!</h1>
          <p className='text-lg text-gray-700 mb-6'>Please enter your username to continue.</p>
          <form onSubmit={handleUserSubmit} className='flex flex-col items-center gap-4'>
            <input
              type='text'
              placeholder='Enter your user name'
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              className='px-4 py-2 border rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled={isSubmittingUser}
              required
            />
            <button
              type='submit'
              disabled={isSubmittingUser || !userNameInput.trim()}
              className='px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 cursor-pointer'
            >
              {isSubmittingUser ? 'Saving...' : 'Submit & Continue'}
            </button>
          </form>
          {userError && <p className='text-red-500 mt-2'>{userError}</p>}
        </div>
      ) : quizCompleted ? (
        <div className='text-center'>
          <h1 className='text-4xl font-bold mb-4 text-green-700'>Quiz Completed, {userNameInput}!</h1>
          <h2 className='text-2xl font-bold mb-10'>Final Score: {score}</h2>
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