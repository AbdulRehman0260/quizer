import express from "express";
import type { Request, Response } from "express";
import { fetchQuizQuestions } from "./controllers/questions.js";

const app = express()
const port = 3000

//testing if this works
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

//question get route
app.get('/api', fetchQuizQuestions)

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`http://localhost:${port}`)
})

