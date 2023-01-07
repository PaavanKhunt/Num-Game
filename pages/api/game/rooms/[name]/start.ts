import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'POST') {
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

  if (room.status !== 'waiting') {
    return res.status(400).json({ error: 'Room is already started' });
  }

  const result = await roomCollection.updateOne(
    {
      name: {
        $regex: new RegExp(`^${roomName}$`, 'i'),
      },
    },
    {
      $set: {
        status: 'started',
      },
    }
  );

  if (!result.matchedCount) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const upRoom = await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${roomName}$`, 'i'),
    },
  });

  res.status(200).json(upRoom);
};

export default handler;
