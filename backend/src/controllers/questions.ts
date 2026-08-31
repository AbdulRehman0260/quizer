import type { Request, Response } from "express";
import { batchQuestions, questionPull as questionPullQuery } from "../db/queries/questions.js";

export const fetchQuizQuestions = async (_req: Request, res: Response) => {
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

  try {
    const data = await fetch('https://opentdb.com/api.php?amount=50&category=23&difficulty=hard&type=multiple')
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
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz questions' })
  }
}

export const batchQuestionsUpdate = async (_req: Request, res: Response) => {
  try {
    const questionsArray = await fetch("http://localhost:3000/api/questions").then(res => res.json());
    await batchQuestions(questionsArray);
    res.status(200).json({ message: 'Questions inserted successfully' });
  } catch (error) {
    console.error('Error inserting questions:', error);
    res.status(500).json({ error: 'Failed to insert questions' });
  }
};

export const questionPull = async (_req: Request, res: Response) => {
  try {
    const quizQuestions = await questionPullQuery();
    if (!quizQuestions || quizQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found' });
    }
    return res.status(200).json(quizQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};