import React from 'react';

function AITools({ setScreen }) {
  return (
    <div>
      <h1>AI Tools & SEO</h1>
      <p>Enhance your website with our suite of AI-powered tools for content and SEO.</p>
      <button onClick={() => setScreen('dashboard')}>Back to Dashboard</button>
    </div>
  );
}

export default AITools;