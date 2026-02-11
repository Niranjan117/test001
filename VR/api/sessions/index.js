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

    if (req.method === 'GET') {
      const sessions = await Session.find({ userId: user.userId })
        .sort({ startTime: -1 })
        .limit(50);
      return res.json({ sessions });
    }

    if (req.method === 'POST') {
      const { sessionName, scenario } = req.body;
      const session = new Session({
        userId: user.userId,
        sessionName,
        scenario,
        startTime: new Date(),
        isActive: true
      });
      await session.save();
      return res.status(201).json({ session });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}