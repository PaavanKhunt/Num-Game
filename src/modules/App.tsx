import React from 'react';
import { Main } from './Main/Main';
import 'atropos/css';

export default function App() {
  return (
    <div className="root">
      <style jsx>{`
        .root {
          width: 100vw;
          height: 100vh;
        }
      `}</style>
      <Main />
    </div>
  );
}
