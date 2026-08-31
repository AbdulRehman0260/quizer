import type { Request, Response } from "express";
import {createUser} from "../db/queries/users.js";
import type { User } from "../db/schema.js";

export const createUserEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (email === undefined || email === null || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Received request to create user with email:', email);

    // Validate the input data
    if (!email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a new user object (you can replace this with your database logic)
    const newUser: User = await createUser({ email });

    // Simulate saving the user to a database (replace this with your actual database logic)
    console.log('New user created:', newUser);

    // Respond with the created user (excluding the password for security reasons)
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};