import { createUser, getUserByUserName } from "../db/queries/users.js";
import { createUserScore, getHighestScorePerUser } from "../db/queries/userScores.js";
export const createUserName = async (req, res) => {
    try {
        const { userName } = req.body;
        if (userName === undefined || userName === null || userName.trim() === '') {
            return res.status(400).json({ error: 'User name is required' });
        }
        // if (!userName) {
        //   return res.status(400).json({ error: 'Missing required fields' });
        //  }
        const newUser = await createUser({ userName });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
export const fetchUser = async (req, res) => {
    try {
        const { userName } = req.params;
        if (typeof userName !== 'string') {
            return res.status(400).json({ error: 'Invalid user name' });
        }
        const user = await getUserByUserName(userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const scores = await getHighestScorePerUser();
        res.status(200).json(scores);
    }
    catch (error) {
        console.error('Error fetching user scores:', error);
        res.status(500).json({ error: 'Failed to fetch user scores' });
    }
};
export const updateUserScore = async (req, res) => {
    try {
        const { userName, score } = req.body;
        if (!userName || typeof score !== 'number') {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        //get user by userName
        const user = await getUserByUserName(userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        //create user score object
        const userScore = { userId: user.id, score };
        // Assuming you have a function to update the user's score in the database
        const updatedUserScore = await createUserScore(userScore);
        res.status(200).json(updatedUserScore);
    }
    catch (error) {
        console.error('Error updating user score:', error);
        res.status(500).json({ error: 'Failed to update user score' });
    }
};
export const saveUserScore = async (req, res) => {
    try {
        const { userName, score } = req.body;
        if (!userName || typeof score !== 'number') {
            return res.status(400).json({ error: 'Missing required fields: userName and score' });
        }
        const user = await getUserByUserName(userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userScore = { userId: user.id, score };
        const savedScore = await createUserScore(userScore);
        res.status(201).json(savedScore);
    }
    catch (error) {
        console.error('Error saving user score:', error);
        res.status(500).json({ error: 'Failed to save user score' });
    }
};
