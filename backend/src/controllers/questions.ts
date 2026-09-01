import type { Request, Response } from "express";
import { batchQuestions, questionPull as questionPullQuery } from "../db/queries/questions.js";

const htmlEntities: Record<string, string> = {
  '&quot;': '"',
  '&#039;': "'",
  '&amp;': '&',
  '&eacute;': 'e',
  '&egrave;': 'e',
  '&iacute;': 'i',
  '&aacute;': 'a',
  '&oacute;': 'o',
  '&uacute;': 'u',
  '&ntilde;': 'n',
  '&ldquo;': '"',
  '&rdquo;': '"',
  '&lsquo;': "'",
  '&rsquo;': "'",
  '&uuml;': 'u',
  '&ouml;': 'o',
  '&auml;': 'a',
  '&hellip;': '...'
}

const decodeHtml = (text: string) =>
  text.replace(/&[a-zA-Z#0-9]+;/g, (match) => htmlEntities[match] ?? match)

const fetchTriviaQuestions = async () => {
  const data = await fetch('https://opentdb.com/api.php?amount=50&category=23&difficulty=hard&type=multiple')
  const json = await data.json()

  return json.results.map((question: { question: string; correct_answer: string; incorrect_answers: string[] }) => {
    const formattedQuestion = decodeHtml(question.question)
    const answer = decodeHtml(question.correct_answer)
    const options = [...question.incorrect_answers.map(decodeHtml), answer]

    options.sort(() => Math.random() - 0.5)

    return {
      question: formattedQuestion,
      options,
      answer,
    }
  })
}

export const fetchQuizQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await fetchTriviaQuestions()
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' })
  }
}

export const batchQuestionsUpdate = async (_req: Request, res: Response) => {
  try {
    const questionsArray = await fetchTriviaQuestions()
    await batchQuestions(questionsArray);
    res.status(200).json({ message: 'Questions inserted successfully' });
  } catch (error) {
    console.error('Error inserting questions:', error);
    res.status(500).json({ error: 'Failed to insert questions' });
  }
};

export const questionPull = async (_req: Request, res: Response) => {
  try {
    let quizQuestions = await questionPullQuery();

    if (!quizQuestions || quizQuestions.length === 0) {
      const fetchedQuestions = await fetchTriviaQuestions()
      await batchQuestions(fetchedQuestions)
      quizQuestions = await questionPullQuery()
    }

    return res.status(200).json(quizQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};