import { Question } from '../types';

interface QuestionBarProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  attemptsRemaining: number;
  paperTitle?: string;
}

export default function QuestionBar({ question, currentIndex, totalQuestions, attemptsRemaining, paperTitle }: QuestionBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-blue-600/30 backdrop-blur-sm p-3 sm:p-4 question-bar">
      <div className="max-w-4xl mx-auto ml-4 sm:ml-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 font-primary-bold drop-shadow-lg">
              {paperTitle ? `${paperTitle} | Q ${currentIndex + 1}/${totalQuestions}` : `Q ${currentIndex + 1}/${totalQuestions}`}
            </h2>
            <div className="flex gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm bg-yellow-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full font-medium font-primary">
                Marks: {question.maxMarks}
              </span>
              <span className="text-xs sm:text-sm bg-yellow-400 text-gray-900 px-2 sm:px-3 py-1 rounded-full font-medium font-primary">
                Attempts: {attemptsRemaining}
              </span>
            </div>
          </div>
        </div>
        <p className="text-white font-medium text-sm sm:text-base leading-relaxed font-primary">{question.questionNumber}: {question.questionText}</p>
        <div className="mt-2 bg-blue-800/30 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
