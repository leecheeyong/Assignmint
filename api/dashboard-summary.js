import { dbConnect, verifyToken, Assignment, StudyGoal, GroupPromise } from '../utils.js';

export default async function handler(req, res) {
  await dbConnect();
  let user;
  try { user = await verifyToken(req); } catch { return res.status(401).end(); }

  const [assignments, goals, promises] = await Promise.all([
    Assignment.find({ userId: user.id }),
    StudyGoal.find({ userId: user.id }),
    GroupPromise.find({ userId: user.id })
  ]);

  const now = new Date();
  const soon = new Date();
  soon.setDate(soon.getDate() + 3);

  const completedGoals = goals.filter(g => g.completed);
  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) >= now && new Date(a.dueDate) <= soon);

  const uniqueTeams = new Set();
  promises.forEach(p => {
    p.teamMembers?.forEach(m => uniqueTeams.add(m));
  });

  res.json({
    assignmentCount: assignments.length,
    completedAssignments: assignments.filter(a => a.completed).length,
    upcomingAssignments: upcomingAssignments.length,
    goalsPending: goals.filter(g => !g.completed).length,
    goalStreak: completedGoals.length,
    groupTasks: promises.length,
    groupPromiseTeams: uniqueTeams.size
  });
}
