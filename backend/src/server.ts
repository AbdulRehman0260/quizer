import express from "express";
import type { Request, Response } from "express";
import { fetchQuizQuestions, batchQuestionsUpdate, questionPull } from "./controllers/questions.js";
import { createUserEmail } from "./controllers/users.js";
import cors from "cors";

const app = express()
const port = 3000
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

//create post route for user creation
app.post('/api/users',createUserEmail)

//question get route
app.get('/api/questions', fetchQuizQuestions)
app.get('/api/questions/quizQuestions', questionPull) 
app.post('/api/questions/batchUpdate', batchQuestionsUpdate)


app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`http://localhost:${port}`)
})