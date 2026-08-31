import { createUser } from "../db/queries/users.js";
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
