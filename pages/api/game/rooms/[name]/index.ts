import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';
import { Room } from '../../../../../src/types/room';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const collection = db.collection('rooms');

  const rooms = await collection.find().toArray();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const room = rooms.find((x) => x.name === req.query.name);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.status(200).json(room);
};

export default handler;
