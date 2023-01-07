import { ReactNode, createContext, useState } from 'react';
import { User } from '../../types/user';

export interface UserContext {
  user: User[];
  addUser: (newUser: User) => void;
}

export const UserContext = createContext<UserContext | null>(null);

export interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider = (props: UserContextProviderProps) => {
  const { children } = props;
  const [user, setuser] = useState<User[]>([]);
  const addUser = (newUser: User) => {
    setuser([...user, newUser]);
  };

  return (
    <UserContext.Provider value={{ user, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
