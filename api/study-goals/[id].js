import { dbConnect, verifyToken, StudyGoal } from '../../utils.js';

export default async function handler(req, res) {
  await dbConnect();
  let user;
  try { user = await verifyToken(req); } catch { return res.status(401).end(); }
  const { method, query: { id } } = req;

  if (!id) return res.status(400).json({ error: 'Missing study goal id' });

  if (method === 'PUT') {
    const updated = await StudyGoal.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Study goal not found' });
    return res.json(updated);
  }
  if (method === 'DELETE') {
    const deleted = await StudyGoal.findOneAndDelete({ _id: id, userId: user.id });
    if (!deleted) return res.status(404).json({ error: 'Study goal not found' });
    return res.status(204).end();
  }
  res.status(405).end();
}
