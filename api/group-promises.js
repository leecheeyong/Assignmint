import { dbConnect, verifyToken, GroupPromise } from '../utils.js';

export default async function handler(req, res) {
  await dbConnect();
  let user;
  try { user = await verifyToken(req); } catch { return res.status(401).end(); }
  const { method } = req;

  if (method === 'GET') {
    const promises = await GroupPromise.find({ userId: user.id });
    return res.json(promises);
  }
  if (method === 'POST') {
    const promise = await GroupPromise.create({ ...req.body, userId: user.id });
    return res.status(201).json(promise);
  }
  res.status(405).end();
}
