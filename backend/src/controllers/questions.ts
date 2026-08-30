import type { Request, Response } from "express";

const htmlEntities: Record<string, string> = {
  '&quot;': '"',
  '&#039;': "'",
  '&amp;': '&',
  '&eacute;': 'é',
  '&egrave;': 'è',
  '&iacute;': 'í',
  '&aacute;': 'á',
  '&oacute;': 'ó',
  '&uacute;': 'ú',
  '&ntilde;': 'ñ',
  '&ldquo;': '"',
  '&rdquo;': '"',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&uuml;': 'ü',
  '&ouml;': 'ö',
  '&auml;': 'ä',
  '&hellip;': '…'
}

const decodeHtml = (text: string) =>
  text.replace(/&[a-zA-Z#0-9]+;/g, (match) => htmlEntities[match] ?? match)

export const fetchQuizQuestions = async (_req: Request, res: Response) => {
  try {
    const data = await fetch('https://opentdb.com/api.php?amount=50&category=9&difficulty=medium&type=multiple')
    const json = await data.json()
    const questions = json.results.map((question: any) => {
      const formattedQuestion = decodeHtml(question.question)
      const answer = decodeHtml(question.correct_answer)
      const options = [...question.incorrect_answers.map(decodeHtml), answer]
      options.sort(() => Math.random() - 0.5)
      return {
        question: formattedQuestion,
        options,
        answer: answer
      }
    })
    console.log('Fetched quiz questions:', questions)
    res.json(questions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' })
  }
}
