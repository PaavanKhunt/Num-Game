import {
  ReactNode,
  createContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { User } from '../../types/user';

export interface UserContextType {
  users: User[];
  addUser: (newUser: User) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider = (props: UserContextProviderProps) => {
  const { children } = props;
  const [users, setusers] = useState<User[]>([]);
  const addUser = (newUser: User) => {
    setusers([...users, newUser]);
  };

  const getUsers = useCallback(async () => {
    const response = await fetch('/api/game/users/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return setusers(data);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
