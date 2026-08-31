import type { Request, Response } from "express";
import {createUser} from "../db/queries/users.js";
import type { User } from "../db/schema.js";

export const createUserEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (email === undefined || email === null || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newUser: User = await createUser({ email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};