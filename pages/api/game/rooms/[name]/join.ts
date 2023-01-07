import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';
import { Room } from '../../../../../src/types/room';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const userCollection = db.collection('users');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;
  let userName: string = req.body.user;

  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  // if (!users.find((x) => x.name === userName)) {
  //   return res.status(400).json({ error: 'User does not exist' });
  // }

  const userExists = await userCollection.findOne({
    name: {
      $regex: new RegExp(`^${userName}$`, 'i'),
    },
  });

  if (!userExists?._id) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  const rooms = await roomCollection.find().toArray();

  const room = rooms.find((x) => x.name === roomName) as Room;

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'waiting') {
    return res.status(400).json({ error: 'Room is full. You cannot join now' });
  }

  if (room.members.find((x) => x.name === userName)) {
    return res.status(400).json({ error: 'User already in room' });
  }

  // room.members.push({
  //   name: userName,
  //   score: 10,
  // });

  const result = await roomCollection.updateOne(
    {
      name: {
        $regex: new RegExp(`^${roomName}$`, 'i'),
      },
    },
    {
      $push: {
        members: {
          name: userName,
          score: 10,
        },
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
