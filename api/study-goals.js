import { dbConnect, verifyToken, StudyGoal } from '../utils.js';

export default async function handler(req, res) {
  await dbConnect();
  let user;
  try { user = await verifyToken(req); } catch { return res.status(401).end(); }
  const { method, query: { id } } = req;

  if (method === 'GET') {
    const goals = await StudyGoal.find({ userId: user.id });
    return res.json(goals);
  }
  if (method === 'POST') {
    const goal = await StudyGoal.create({ ...req.body, userId: user.id });
    return res.status(201).json(goal);
  }
  if (method === 'PUT' && id) {
    const updated = await StudyGoal.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: req.body },
      { new: true }
    );
    return res.json(updated);
  }
  res.status(405).end();
}
