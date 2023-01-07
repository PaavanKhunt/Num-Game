import { Room } from '../types/room';

// const room: Room = {
//   name: 'Room name',
//   owner: 'user-id',
//   members: [{ name: 'user-id', score: 10 }],
//   status: 'waiting',
//   winner: null,
//   currentRound: [{ user: 'user-id', value: 10 }],
//   rounds: [
//     {
//       scores: [
//         { user: 'user-id', value: 10, score: 0 },
//         {
//           user: 'user-id2',
//           value: null,
//           score: -10,
//         },
//         { user: 'user-id3', value: 20, score: -1 },
//       ],
//     },
//   ],
// };

export const secureRoomResponse = (room: Room) => {
  const { currentRound, ...rest } = room;
  return {
    ...rest,
    currentRound: currentRound.map((x) => ({ user: x.user, value: 'xx' })),
  };
};
