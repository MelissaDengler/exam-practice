export interface Question {
  questionNumber: string;
  questionText: string;
  maxMarks: number;
  solutionDetails: {
    correctAnswer: string;
    workings: string;
    markingGuidelines: string;
    explanation: string;
  };
  isLongAnswer: boolean;
  maxAttempts?: number; // Optional field for attempt limits
}

export interface Paper {
  id: string;
  subject: string;
  year: number;
  questions: Question[];
}

export interface Message {
  id: string;
  sender: 'ruby' | 'user';
  text: string;
  timestamp: number;
}

export interface QuestionState {
  attemptsRemaining: number;
  isCompleted: boolean;
  marksEarned: number;
  isSkipped: boolean;
}
