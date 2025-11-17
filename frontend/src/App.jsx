import React from 'react';
import Calendar from './components/Calendar';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Calendar App</h1>
      </header>
      <main>
        <Calendar />
      </main>
    </div>
  );
}
