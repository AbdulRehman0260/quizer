import express from "express";
import type { Request, Response } from "express";
import { fetchQuizQuestions, batchQuestionsUpdate, questionPull } from "./controllers/questions.js";
import { createUserName } from "./controllers/users.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express()
const host = process.env.HOST ?? '0.0.0.0'
const port = Number(process.env.PORT ?? 3000)
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'
app.use(express.json());

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

//create post route for user creation
app.post('/api/users',createUserName)

//question get route
app.get('/api/questions', fetchQuizQuestions)
app.get('/api/questions/quizQuestions', questionPull) 
app.post('/api/questions/batchUpdate', batchQuestionsUpdate)


app.listen(port, host, async () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`http://${host}:${port}`)
})