import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizItem, Option, SavedItem } from '../types';
import { quizData } from '../data/quizData';
import StarIcon from './icons/StarIcon';

// We'll add a property to track repetitions for incorrect answers
interface GameQuizItem extends QuizItem {
  repetitionScheduled?: boolean;
}

interface GameViewProps {
  score: number;
  onScore: (newScore: number) => void;
  savedItems: SavedItem[];
  toggleSaveItem: (item: SavedItem) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const GameView: React.FC<GameViewProps> = ({ score, onScore, savedItems, toggleSaveItem }) => {
  const [questionQueue, setQuestionQueue] = useState<GameQuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<'pending' | 'correct' | 'incorrect_try'>('pending');
  const [showCorrect, setShowCorrect] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<{ type: string; id: string | number; text: string } | null>(null);

  useEffect(() => {
    // Initialize the queue with shuffled data. No items have `repetitionScheduled` yet.
    setQuestionQueue(shuffleArray(quizData));
  }, []);

  const currentQuestion = useMemo(() => {
    return questionQueue.length > 0 ? questionQueue[currentIndex] : null;
  }, [questionQueue, currentIndex]);

  const handleAnswer = useCallback((option: Option) => {
    if (answerState !== 'pending') return;

    const currentQuestion = questionQueue[currentIndex];

    if (option.isCorrect) {
      // CORRECT ANSWER
      setAnswerState('correct');
      onScore(score + 1);
      setShowCorrect(true);
      // Per instructions, we no longer re-queue correct answers.
      // The user will proceed to the next question in the list by clicking the "Next" button.
    } else {
      // INCORRECT ANSWER
      setAnswerState('incorrect_try');
      
      // Re-queue the question for one future repetition, but only if it hasn't been already.
      if (currentQuestion && !currentQuestion.repetitionScheduled) {
        const newQueue = [...questionQueue];
        
        // Remove the current item to re-insert it later.
        const [item] = newQueue.splice(currentIndex, 1);
        
        // Mark it as having a repetition scheduled to prevent re-queuing it again.
        const itemToRequeue: GameQuizItem = { ...item, repetitionScheduled: true };
        
        // Calculate a new index at least 10 positions away.
        const offset = Math.floor(Math.random() * 5) + 10; // 10 to 14
        const nextIndex = Math.min(currentIndex + offset, newQueue.length);
        
        newQueue.splice(nextIndex, 0, itemToRequeue);
        setQuestionQueue(newQueue);
      }

      // Allow the user to try again on the current question after a short delay.
      setTimeout(() => {
        setAnswerState('pending');
      }, 1500);
    }
  }, [answerState, currentIndex, onScore, questionQueue, score]);
  
  const handleNextQuestion = useCallback(() => {
    setAnswerState('pending');
    setShowCorrect(false);
    setCurrentIndex(prev => (prev + 1) % questionQueue.length);
  }, [questionQueue.length]);
  
  const isSaved = (type: 'sentence' | 'word', id: number | string) => {
    const itemId = type === 'sentence' ? `sentence-${id}` : `word-${id}`;
    return savedItems.some(item => item.id === itemId);
  };

  const handleSaveClick = (e: React.MouseEvent, type: 'sentence' | 'word', item: QuizItem | Option, itemId: number | string) => {
    e.stopPropagation();
    if (type === 'sentence' && 'sentence' in item) {
      toggleSaveItem({ id: `sentence-${itemId}`, type: 'sentence', content: item.sentence.replace('__', item.correctWord), translation: item.sentence_pl });
    } else if (type === 'word' && 'word' in item) {
       toggleSaveItem({ id: `word-${itemId}`, type: 'word', content: item.word, translation: item.word_pl });
    }
  };

  const renderSentence = () => {
    if (!currentQuestion) return null;
    let sentenceText = currentQuestion.sentence;
    let sentenceClass = "transition-colors duration-500";
    if (showCorrect) {
      // This fulfills the requirement to show the filled sentence on correct answer.
      sentenceText = sentenceText.replace('__', ` ${currentQuestion.correctWord} `);
      sentenceClass = "text-green-400";
    } else if (answerState === 'incorrect_try') {
      sentenceClass = "text-yellow-400";
    }
    return (
      <div className="relative" 
           onMouseEnter={() => setHoveredItem({ type: 'sentence', id: currentQuestion.id, text: currentQuestion.sentence_pl })}
           onMouseLeave={() => setHoveredItem(null)}>
        <p className={`text-3xl lg:text-4xl font-light text-center ${sentenceClass}`}>
          {sentenceText}
        </p>
        {hoveredItem && hoveredItem.type === 'sentence' && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-white text-sm rounded-md shadow-lg z-10">
            {hoveredItem.text}
          </div>
        )}
      </div>
    );
  };

  if (!currentQuestion) {
    return <div className="text-center text-xl">Ładowanie pytań...</div>;
  }

  return (
    <div className="w-full max-w-5xl flex flex-col items-center justify-center flex-grow">
      <div className="w-full p-8 space-y-12">
        <div className="h-24 flex items-center justify-center relative">
          {renderSentence()}
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-10">
            <StarIcon 
              isFilled={isSaved('sentence', currentQuestion.id)}
              onClick={(e) => handleSaveClick(e, 'sentence', currentQuestion, currentQuestion.id)}
            />
          </div>
        </div>
        
        <div className="w-full border-b border-gray-700"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentQuestion.options.map(option => {
            const isSelectedCorrect = showCorrect && option.isCorrect;
            const isSelectedIncorrect = answerState === 'incorrect_try' && !option.isCorrect; 

            return (
              <div key={option.word} 
                   className={`relative rounded-lg p-4 text-center transition-all duration-300 transform 
                     ${answerState === 'pending' ? 'cursor-pointer hover:bg-gray-800 hover:border-blue-500 hover:-translate-y-1' : 'cursor-not-allowed'}
                     ${isSelectedCorrect ? 'bg-green-500/20 border-green-500' : 'border-gray-600'}
                     ${isSelectedIncorrect ? 'opacity-50' : ''}
                     bg-gray-900 border`}
                   onClick={() => handleAnswer(option)}
                   onMouseEnter={() => setHoveredItem({ type: 'option', id: option.word, text: option.word_pl })}
                   onMouseLeave={() => setHoveredItem(null)}>
                
                <span className="text-lg">{option.word}</span>
                
                {hoveredItem && hoveredItem.type === 'option' && hoveredItem.id === option.word && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded-md shadow-lg z-10">
                    {hoveredItem.text}
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  <StarIcon 
                     isFilled={isSaved('word', option.word)}
                     onClick={(e) => handleSaveClick(e, 'word', option, option.word)}
                     className="w-5 h-5"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showCorrect && (
          <button onClick={handleNextQuestion} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
            Następne pytanie
          </button>
      )}
    </div>
  );
};

export default GameView;