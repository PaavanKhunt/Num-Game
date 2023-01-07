import React, { useCallback, useEffect, useState } from 'react';
import { UserRegister } from './UserRegister';
import { User } from '../types/user';

export default function Main() {
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
    <>
      <UserRegister />
      <br />
      {users.map((user, index) => (
        <div key={index}>
          <p>{user.name}</p>
        </div>
      ))}
    </>
  );
}
