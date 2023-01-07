import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../src/mongodb';
import { Room } from '../../../../../src/types/room';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;
  const vote = req.body.vote;
  const userName: string = req.body.user;

  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  // const room = rooms.find((x) => x.name === roomName);

  const room = (await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${roomName}$`, 'i'),
    },
  })) as Room;

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'started') {
    return res.status(400).json({ error: 'Room is not started' });
  }

  if (!room.members.find((x) => x.name === userName)) {
    return res.status(400).json({ error: 'User is not in room' });
  }

  if (room.currentRound.find((x) => x.user === userName)) {
    return res.status(400).json({ error: 'User already voted' });
  }

  // room.currentRound.push({
  //   user: userName,
  //   value: vote,
  // });

  const result = await roomCollection.updateOne(
    {
      name: {
        $regex: new RegExp(`^${roomName}$`, 'i'),
      },
    },
    {
      $push: {
        currentRound: {
          user: userName,
          value: vote,
        },
      },
    }
  );

  if (result.modifiedCount === 0) {
    return res.status(400).json({ error: 'Failed to update room' });
  }

  res.status(200).json({
    message: 'Vote recorded. Please wait for the next round.',
  });
};

export default handler;
