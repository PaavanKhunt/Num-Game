import React, { useCallback, useEffect, useState } from 'react';
import { User } from '../../types/user';
import { Inter } from '@next/font/google';
import { UserRegister } from '../UserRegister';
import Atropos from 'atropos/react';

const inter = Inter({ subsets: ['latin'] });

export const Main = () => {
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = useCallback(async () => {
    const response = await fetch('/api/game/users/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return setUsers(data);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="register_container inter">
      <style jsx>{`
        .register_container {
          display: flex;
          height: 100%;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .card_container {
          border: 1px solid #ccc;
          background-color: #fff;
          padding: 3rem;
        }
      `}</style>
      <Atropos>
        <div className="card_container">
          <UserRegister />
          <br />
          {users.map((user, index) => (
            <div key={index}>
              <p>{user.name.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </Atropos>
    </div>
  );
};
