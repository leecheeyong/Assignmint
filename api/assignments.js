import { dbConnect, verifyToken, Assignment } from '../utils.js';

export default async function handler(req, res) {
  await dbConnect();
  let user;
  try { user = await verifyToken(req); } catch { return res.status(401).end(); }
  const { method, query: { id } } = req;

  if (method === 'GET') {
    const assignments = await Assignment.find({ userId: user.id }).sort({ dueDate: 1 });
    return res.json(assignments);
  }
  if (method === 'POST') {
    const assignment = await Assignment.create({ ...req.body, userId: user.id });
    return res.status(201).json(assignment);
  }
  if (method === 'PUT' && id) {
    const updated = await Assignment.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: req.body },
      { new: true }
    );
    return res.json(updated);
  }
  if (method === 'DELETE' && id) {
    await Assignment.findOneAndDelete({ _id: id, userId: user.id });
    return res.status(204).end();
  }
  res.status(405).end();
}
