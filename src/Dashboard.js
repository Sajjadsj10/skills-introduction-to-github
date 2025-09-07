import React from 'react';

function Dashboard({ setScreen }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Here you can see your projects and create new ones.</p>
      <button onClick={() => setScreen('editor')}>Create New Website</button>
    </div>
  );
}

export default Dashboard;