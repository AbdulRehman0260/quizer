const htmlEntities = {
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
};
const decodeHtml = (text) => text.replace(/&[a-zA-Z#0-9]+;/g, (match) => htmlEntities[match] ?? match);
export const fetchQuizQuestions = async (_req, res) => {
    try {
        const data = await fetch('https://opentdb.com/api.php?amount=50&category=9&difficulty=medium&type=multiple');
        const json = await data.json();
        const questions = json.results.map((question) => {
            const formattedQuestion = decodeHtml(question.question);
            const correctAnswer = decodeHtml(question.correct_answer);
            const options = [...question.incorrect_answers.map(decodeHtml), correctAnswer];
            options.sort(() => Math.random() - 0.5);
            return {
                question: formattedQuestion,
                options,
                correctAnswer
            };
        });
        console.log('Fetched quiz questions:', questions);
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
};
