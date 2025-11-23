import React, { useState, useEffect } from 'react';
import { SpaceAuth } from './components/SpaceAuth';
import { ChatInterface } from './components/ChatInterface';
import { User, AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSpaceId, setCurrentSpaceId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = sessionStorage.getItem('loveroom_session');
    if (savedSession) {
      const { user, spaceId } = JSON.parse(savedSession);
      setCurrentUser(user);
      setCurrentSpaceId(spaceId);
      setCurrentView(AppView.SPACE);
    }
  }, []);

  const handleJoinSpace = (spaceId: string, user: User) => {
    setCurrentUser(user);
    setCurrentSpaceId(spaceId);
    setCurrentView(AppView.SPACE);
    
    // Save session for refresh
    sessionStorage.setItem('loveroom_session', JSON.stringify({ user, spaceId }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loveroom_session');
    setCurrentUser(null);
    setCurrentSpaceId(null);
    setCurrentView(AppView.LANDING);
  };

  return (
    <div className="h-full w-full">
      {currentView === AppView.LANDING && (
        <SpaceAuth onJoin={handleJoinSpace} />
      )}
      {currentView === AppView.SPACE && currentUser && currentSpaceId && (
        <ChatInterface 
          user={currentUser} 
          spaceId={currentSpaceId} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;