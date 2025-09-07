import React from 'react';
import Dashboard from './Dashboard';
import Editor from './Editor';
import AITools from './AITools';

function App() {
  const [screen, setScreen] = React.useState('dashboard');

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard setScreen={setScreen} />;
      case 'editor':
        return <Editor setScreen={setScreen} />;
      case 'ai-tools':
        return <AITools setScreen={setScreen} />;
      default:
        return <Dashboard setScreen={setScreen} />;
    }
  };

  return (
    <div className="App">
      <header>
        <nav>
          <button onClick={() => setScreen('dashboard')}>Dashboard</button>
          <button onClick={() => setScreen('editor')}>Editor</button>
          <button onClick={() => setScreen('ai-tools')}>AI Tools</button>
        </nav>
      </header>
      <main>
        {renderScreen()}
      </main>
    </div>
  );
}

export default App;