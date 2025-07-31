import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) throw new Error('Unauthorized');
  const token = auth.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const assignmentSchema = new mongoose.Schema({
  title: String,
  course: String,
  dueDate: Date,
  type: String,
  notes: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const studyGoalSchema = new mongoose.Schema({
  subject: String,
  hoursTarget: Number,
  currentHours: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const groupPromiseSchema = new mongoose.Schema({
  title: String,
  teamMembers: [String],
  deadline: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
export const StudyGoal = mongoose.models.StudyGoal || mongoose.model('StudyGoal', studyGoalSchema);
export const GroupPromise = mongoose.models.GroupPromise || mongoose.model('GroupPromise', groupPromiseSchema);

export async function signupUser(email, password) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
}