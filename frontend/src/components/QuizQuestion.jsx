
const QuizQuestion = ({quizBank, onAnswer}) => {
  return (
    <div className='flex flex-col items-center text-center'>
      <h1 className='text-4xl font-bold text-green-700 mb-12'>{quizBank.question}</h1>
      <div className='grid grid-cols-2 gap-4 w-full max-w-md'>
            {quizBank.options.map(option => (
              <button key={option} onClick={() => onAnswer(option)} className='px-6 py-4 bg-white border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition duration-200 cursor-pointer'>
                {option}
              </button>
            ))}
      </div>
    </div>
  )
}

export default QuizQuestion
