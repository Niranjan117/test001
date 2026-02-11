import { connectDB, Session } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';

import { connectDB, Session } from '../utils/db.js';
import { verifyToken } from '../utils/auth.js';

export default async function handler(req, res) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectDB();
    const { id } = req.query;

    if (req.method === 'GET') {
      const session = await Session.findOne({ _id: id, userId: user.userId });
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.json({ session });
    }

    if (req.method === 'PUT') {
      const session = await Session.findOneAndUpdate(
        { _id: id, userId: user.userId },
        { 
          endTime: new Date(),
          isActive: false,
          duration: Math.floor((new Date() - session.startTime) / 1000)
        },
        { new: true }
      );
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      return res.json({ session });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}