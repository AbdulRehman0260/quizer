import { createUser } from "../db/queries/users.js";
export const createUserEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email === undefined || email === null || email.trim() === '') {
            return res.status(400).json({ error: 'Email is required' });
        }
        if (!email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newUser = await createUser({ email });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
