
export interface Option {
  word: string;
  word_pl: string;
  isCorrect: boolean;
}

export interface QuizItem {
  id: number;
  sentence: string; // e.g., "We need to ___ our efforts."
  sentence_pl: string;
  options: Option[];
  correctWord: string;
}

export interface SavedItem {
  id: string; // Can be `word-{word}` or `sentence-{id}`
  type: 'word' | 'sentence';
  content: string;
  translation: string;
}
