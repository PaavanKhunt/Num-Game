import type { NextApiRequest, NextApiResponse } from 'next';
import { Room, RoomModel } from '../../../../src/types/room';
import clientPromise from '../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const userCollection = db.collection('users');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  let name: string = req.body.name;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  name = name.toLowerCase().replace(/\W/g, '');

  if (!name) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (!body.owner) {
    return res.status(400).json({ error: 'Owner is required' });
  }

  // if (!users.find((x) => x.name === body.owner)) {
  //   return res.status(400).json({ error: 'Owner does not exist' });
  // }

  const ownerExists = await userCollection.findOne({
    name: {
      $regex: new RegExp(`^${body.owner}$`, 'i'),
    },
  });

  if (!ownerExists?._id) {
    return res.status(400).json({ error: 'Owner does not exist' });
  }

  const roomExists = await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${name}$`, 'i'),
    },
  });

  if (roomExists?._id) {
    return res.status(400).json({ error: 'Room already exists with name' });
  }

  // if (rooms.find((x) => x.name === name)) {
  //   return res.status(400).json({ error: 'Room already exists with name' });
  // }

  const room: Omit<Room, '_id'> = {
    name: name,
    owner: body.owner,
    winner: null,
    currentRound: [],
    members: [
      {
        name: body.owner,
        score: 10,
      },
    ],
    rounds: [],
    status: 'waiting',
  };

  // const room = await RoomModel.create(roomInput);

  const result = await roomCollection.insertOne(room);

  if (!result.acknowledged) {
    return res.status(500).json({ error: 'Failed to create room' });
  }

  // rooms.push(room);

  const upRoom = await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${name}$`, 'i'),
    },
  });

  res.status(200).json(upRoom);
};

export default handler;
