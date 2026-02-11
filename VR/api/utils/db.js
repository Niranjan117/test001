import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['trainee', 'instructor', 'admin'], default: 'trainee' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionName: { type: String, required: true },
  scenario: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number },
  sensorData: [{ type: Object }],
  performanceScore: { type: Number, min: 0, max: 100 },
  feedback: { type: String },
  isActive: { type: Boolean, default: true }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);