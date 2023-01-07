import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// export const rooms: Room[] = [];

interface CurrentRoundItem {
  user: string;
  value: number;
}

export interface Round {
  scores: Score[];
}

export interface Score {
  user: string;
  value: number | null;
  score: number;
}

export interface RoomMember {
  name: string;
  score: number;
}

export interface Room {
  _id: ObjectId;
  name: string;
  owner: string;
  members: RoomMember[];
  status: 'waiting' | 'started' | 'completed';
  winner: string | null;
  rounds: Round[];
  currentRound: CurrentRoundItem[];
}

const scoreSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const roundSchema = new mongoose.Schema({
  scores: [scoreSchema],
});

const currentRoundSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: false,
  },
  rounds: [roundSchema],
  currentRound: [currentRoundSchema],
});

export const RoomModel = mongoose.model<Room>('Room', roomSchema);
