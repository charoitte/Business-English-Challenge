
import React from 'react';
import { SavedItem } from '../types';
import StarIcon from './icons/StarIcon';

interface SavedListViewProps {
  savedItems: SavedItem[];
  onBack: () => void;
  toggleSaveItem: (item: SavedItem) => void;
}

const SavedListView: React.FC<SavedListViewProps> = ({ savedItems, onBack, toggleSaveItem }) => {
  return (
    <div className="w-full max-w-4xl p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-white">Zapisana lista</h1>
      {savedItems.length === 0 ? (
        <p className="text-gray-400">Nie masz jeszcze żadnych zapisanych słówek ani zdań.</p>
      ) : (
        <div className="w-full space-y-4">
          {savedItems.map(item => (
            <div key={item.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-lg text-white">{item.type === 'word' ? item.content : `"${item.content}"`}</p>
                <p className="text-sm text-gray-400">{item.translation}</p>
              </div>
              <button onClick={() => toggleSaveItem(item)} aria-label="Usuń z listy">
                <StarIcon isFilled={true} onClick={() => toggleSaveItem(item)} />
              </button>
            </div>
          ))}
        </div>
      )}
      <button 
        onClick={onBack} 
        className="mt-12 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
        Wróć do gry
      </button>
    </div>
  );
};

export default SavedListView;
