import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;

  if (!roomName) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  const room = await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${roomName}$`, 'i'),
    },
  });

  // const room = rooms.find((x) => x.name === roomName);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const owner = req.body.user as string;

  if (!owner) {
    return res.status(400).json({ error: 'Owner name is required' });
  }

  if (room.owner !== req.body.user) {
    return res.status(400).json({
      error: 'Only owner can reset the room',
    });
  }

  const result = await roomCollection.deleteOne({
    name: {
      $regex: new RegExp(`^${roomName}$`, 'i'),
    },
  });

  if (!result.deletedCount) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.status(200).json({ message: 'Room deleted' });
};

export default handler;
