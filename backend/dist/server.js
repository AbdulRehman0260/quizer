import express from "express";
import { fetchQuizQuestions, batchQuestionsUpdate, questionPull } from "./controllers/questions.js";
import { createUserName, fetchUser, getAllUsers, updateUserScore, saveUserScore } from "./controllers/users.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT);
const corsOrigin = process.env.CORS_ORIGIN;
app.use(express.json());
app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//get scores for all users
app.get('/api/scores', getAllUsers);
app.post('/api/scores', saveUserScore);
//create post route for user creation
app.post('/api/users', createUserName);
app.get('/api/users/:userName', fetchUser);
app.put('/api/users/score', updateUserScore);
//question get route
app.get('/api/questions', fetchQuizQuestions);
app.get('/api/questions/quizQuestions', questionPull);
app.post('/api/questions/batchUpdate', batchQuestionsUpdate);
app.listen(port, host, async () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`http://${host}:${port}`);
});
