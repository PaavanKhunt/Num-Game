import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const userCollection = db.collection('users');

  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const userName: string = req.query.name as string;

  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  const user = await userCollection.findOneAndUpdate(
    {
      name: {
        $regex: new RegExp(`^${userName}$`, 'i'),
      },
    },
    {
      $set: {
        name: req.body.name,
      },
    }
  );

  if (!user.value) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({ message: 'User updated' });
}
