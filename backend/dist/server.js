import express from "express";
import { fetchQuizQuestions } from "./controllers/questions.js";
import { createUserEmail } from "./controllers/users.js";
const app = express();
const port = 3000;
app.use(express.json());
//testing if this works
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
//create post route for user creation
app.post('/api/users', createUserEmail);
//question get route
app.get('/api', fetchQuizQuestions);
app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});
