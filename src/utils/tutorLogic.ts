import { Question } from '../types';

export const checkAnswer = (userAnswer: string, correctAnswer: string, isLongAnswer: boolean): boolean => {
  const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');

  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);

  if (isLongAnswer) {
    const keywords = normalizedCorrect.split(' ').filter(word => word.length > 3);
    const matchCount = keywords.filter(keyword => normalizedUser.includes(keyword)).length;
    return matchCount >= keywords.length * 0.6;
  }

  const cleanUser = normalizedUser.replace(/[,\sR]/g, '');
  const cleanCorrect = normalizedCorrect.replace(/[,\sR]/g, '');

  return cleanUser === cleanCorrect;
};

export const generateHint = (question: Question, attemptNumber: number): string => {
  const { workings, explanation, correctAnswer } = question.solutionDetails;
  const maxAttempts = question.maxAttempts || 5;

  // For questions with limited attempts (2-3), provide more direct hints
  if (maxAttempts <= 3) {
    switch (attemptNumber) {
      case maxAttempts - 1:
        return `Think about the core concept. ${explanation.split('.')[0]}.`;
      
      case 1:
        if (question.questionText.includes('(') && question.questionText.includes(')')) {
          const match = question.questionText.match(/\((.*?)\)/);
          if (match) {
            return `The answer is one of these options: ${match[1]}. Eliminate what doesn't fit the definition.`;
          }
        }
        return `Last try! Think carefully about the formula or principle involved.`;
      
      default:
        return `Review the concept and try again.`;
    }
  }

  // For questions with more attempts (4-5), use the original logic
  switch (attemptNumber) {
    case 4:
      return `Think about the core concept. ${explanation.split('.')[0]}.`;

    case 3:
      if (question.isLongAnswer) {
        return `Consider these key points: ${workings.substring(0, 80)}...`;
      }
      return `Here's a clue: The answer relates to ${workings.split('[')[0].trim().substring(0, 50)}...`;

    case 2:
      if (!question.isLongAnswer && correctAnswer.includes('/')) {
        const options = correctAnswer.split('/');
        return `You're getting closer. Try thinking about: ${options[0]} vs the alternatives.`;
      }
      return `Focus on: ${explanation.split('.')[1] || explanation.split('.')[0]}.`;

    case 1:
      if (question.questionText.includes('(') && question.questionText.includes(')')) {
        const match = question.questionText.match(/\((.*?)\)/);
        if (match) {
          return `The answer is one of these options. Eliminate what doesn't fit the definition.`;
        }
      }
      return `Last try! Think carefully about the formula or principle involved.`;

    default:
      return `Review the concept and try again.`;
  }
};

export const calculateMarks = (isCorrect: boolean, attemptsUsed: number, maxMarks: number): number => {
  if (!isCorrect) return 0;
  if (attemptsUsed === 1) return maxMarks;
  if (attemptsUsed <= 2) return Math.ceil(maxMarks * 0.9);
  return Math.ceil(maxMarks * 0.8);
};
