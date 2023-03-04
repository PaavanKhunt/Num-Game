import React from 'react';
import { toast } from 'react-toastify';

export const UserRegister = () => {
  const [name, setName] = React.useState<string>('');

  const handleSubmit = async () => {
    const response = await fetch('/api/game/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
    }
    if (data.name) {
      toast.success('User registered successfully');
    }
  };

  return (
    <>
      <style jsx>{`
        .form_coatainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .input {
          margin: 10px;
        }
      `}</style>
      <div className="form_coatainer">
        <div>User Registeration</div>
        <div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-primary w-full max-w-xs"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => handleSubmit()}
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
};
