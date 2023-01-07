import type { NextApiRequest, NextApiResponse } from 'next';
import { User, UserModel } from '../../../../src/types/user';
import clientPromise from '../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const collection = db.collection('users');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  let name: string = req.body.name;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  name = name.toLowerCase().replace(/\W/g, '');

  if (!name) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  const userExists = await collection.findOne({
    name: {
      $regex: new RegExp(`^${name}$`, 'i'),
    },
  });

  if (userExists?._id) {
    return res.status(400).json({ error: 'Name already taken' });
  }

  // if (users.find((x) => x.name === name)) {
  //   return res.status(400).json({ error: 'Name already taken' });
  // }

  const user: Omit<User, '_id'> = {
    name,
    inactive: false,
  };

  // const user = await UserModel.create(userInput);
  const result = await collection.insertOne(user);
  console.log(result);

  if (!result.acknowledged) {
    return res.status(500).json({ error: 'Failed to register user' });
  }

  // users.push(user);

  res.status(200).json(user);
};

export default handler;
