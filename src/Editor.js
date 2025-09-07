import React from 'react';

function Editor({ setScreen }) {
  return (
    <div>
      <h1>Website Editor</h1>
      <p>This is where you will build your website with our drag-and-drop editor and AI tools.</p>
      <button onClick={() => setScreen('dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default Editor;