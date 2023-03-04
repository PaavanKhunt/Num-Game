import { ReactNode, createContext, useState } from 'react';
import { Room } from '../../types/room';

type RoomContextType = {
  rooms: Room[];
  setRoom: (room: Room) => void;
};

type RoomContextProviderProps = {
  children: ReactNode;
};

export const RoomContext = createContext({} as RoomContextType);

export const RoomContextProvider = ({ children }: RoomContextProviderProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const setRoom = (room: Room) => {
    setRooms([...rooms, room]);
  };

  return (
    <RoomContext.Provider value={{ rooms, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};
