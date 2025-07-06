
import React, { useState, useCallback, useEffect } from 'react';
import { SavedItem } from './types';
import GameView from './components/GameView';
import SavedListView from './components/SavedListView';
import ListIcon from './components/icons/ListIcon';

const SAVED_ITEMS_STORAGE_KEY = 'businessEnglishChallengeSavedItems';

const App: React.FC = () => {
  const [view, setView] = useState<'game' | 'list'>('game');
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0); // Key to force re-mount GameView on restart

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const items = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not load saved items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (error) {
      console.error("Could not save items to localStorage", error);
    }
  }, [savedItems]);

  const toggleSaveItem = useCallback((itemToToggle: SavedItem) => {
    setSavedItems(prevItems => {
      const isAlreadySaved = prevItems.some(item => item.id === itemToToggle.id);
      if (isAlreadySaved) {
        return prevItems.filter(item => item.id !== itemToToggle.id);
      } else {
        return [...prevItems, itemToToggle];
      }
    });
  }, []);
  
  const handleRestart = () => {
    setScore(0);
    setView('game');
    setGameKey(prevKey => prevKey + 1); // Change key to force GameView re-mount and state reset
  };

  return (
    <div className="bg-black text-gray-100 min-h-screen font-sans p-4 sm:p-6 flex flex-col items-center relative">
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Business English <span className="text-blue-500">Challenge</span>
        </h1>
        <div className="flex items-center gap-4 sm:gap-6">
            <button
                onClick={handleRestart}
                className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
                Od nowa
            </button>
            <div className="text-right">
                <span className="text-sm text-gray-400">PUNKTY</span>
                <p className="text-3xl font-bold text-green-400">{score}</p>
            </div>
        </div>
      </header>

      <main className="w-full flex-grow flex items-center justify-center">
        {view === 'game' ? (
          <GameView 
            key={gameKey}
            score={score}
            onScore={setScore}
            savedItems={savedItems}
            toggleSaveItem={toggleSaveItem}
          />
        ) : (
          <SavedListView 
            savedItems={savedItems} 
            onBack={() => setView('game')}
            toggleSaveItem={toggleSaveItem} 
          />
        )}
      </main>

      {view === 'game' && (
        <button
          onClick={() => setView('list')}
          className="fixed bottom-6 right-6 bg-gray-800 p-4 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg border border-gray-700"
          aria-label="Pokaż zapisaną listę"
        >
          <ListIcon />
        </button>
      )}
    </div>
  );
};

export default App;
