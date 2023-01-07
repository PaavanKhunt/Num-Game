import type { NextApiRequest, NextApiResponse } from 'next';
import { Room, Round } from '../../../../../src/types/room';
import clientPromise from '../../../../../src/mongodb';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('mindDB');
  const roomCollection = db.collection('rooms');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;

  const rooms = await roomCollection.find().toArray();

  const room = rooms.find((x) => x.name === roomName) as Room;

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'started') {
    return res.status(400).json({ error: 'Room is not active' });
  }

  if (room.currentRound.length === 0) {
    return res.status(400).json({ error: 'No one given value' });
  }

  const avg =
    room.currentRound.reduce((p, c) => p + c.value, 0) /
    room.currentRound.length;

  const outputValue = avg * 0.8;

  const nearestNumber = room.currentRound.reduce((p, c) => {
    if (p === -1) {
      return c.value;
    }
    if (Math.abs(c.value - outputValue) < Math.abs(p - outputValue)) {
      return c.value;
    }

    return p;
  }, -1);

  const outMembers: any[] = [];

  const round: Round = {
    scores: [],
  };

  room.members
    .filter((x) => x.score > 0)
    .forEach((member) => {
      const item = room.currentRound.find((x) => x.user === member.name);

      if (!item) {
        member.score = -1;
        outMembers.push(member.name);
        round.scores.push({
          user: member.name,
          value: -1,
          score: -10,
        });
        return;
      }

      if (item.value !== nearestNumber) {
        member.score--;
        round.scores.push({
          user: member.name,
          value: item.value,
          score: -1,
        });
        if (member.score === 0) {
          outMembers.push(member.name);
        }
        return;
      } else {
        round.scores.push({
          user: member.name,
          value: item.value,
          score: 0,
        });
      }
    });

  room.currentRound = [];
  room.rounds.push(round);
  const players = room.members.filter((x) => x.score > 0);

  if (players.length === 1) {
    room.status = 'completed';
    room.winner = players[0].name;
  }

  const result = await roomCollection.updateOne(
    {
      name: {
        $regex: new RegExp(`^${roomName}$`, 'i'),
      },
    },
    {
      $set: {
        winner: room.winner,
        currentRound: room.currentRound,
        rounds: room.rounds,
        members: room.members,
        status: room.status,
      },
    }
  );

  if (!result.matchedCount) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const upRoom = (await roomCollection.findOne({
    name: {
      $regex: new RegExp(`^${roomName}$`, 'i'),
    },
  })) as Room;

  res.status(200).json({
    players: upRoom?.members.filter((x) => x.score > 0),
    out: outMembers,
  });
};

export default handler;
