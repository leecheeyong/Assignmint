import { dbConnect, signupUser } from '../utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await dbConnect();
  const { email, password } = req.body;
  try {
    const token = await signupUser(email, password);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
}