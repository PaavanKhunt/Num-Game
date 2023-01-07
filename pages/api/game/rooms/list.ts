import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const collection = db.collection('rooms');

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const rooms = await collection.find().toArray();
  res.status(200).json(rooms);
};

export default handler;
