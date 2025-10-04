export interface PracticeStats {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastPracticeDate: string;
  improvementRate: number;
  weakAreas: string[];
  strongAreas: string[];
}

export const getDefaultStats = (): PracticeStats => ({
  totalSessions: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  streakDays: 0,
  lastPracticeDate: '',
  improvementRate: 0,
  weakAreas: [],
  strongAreas: []
});

export const loadStats = (): PracticeStats => {
  const savedStats = localStorage.getItem('ruby-practice-stats');
  return savedStats ? JSON.parse(savedStats) : getDefaultStats();
};

export const saveStats = (stats: PracticeStats): void => {
  localStorage.setItem('ruby-practice-stats', JSON.stringify(stats));
};

export const updateStats = (
  isCorrect: boolean,
  questionNumber: string,
  timeSpent: number = 0
): PracticeStats => {
  const currentStats = loadStats();
  
  // Update basic stats
  const newStats = {
    ...currentStats,
    totalQuestions: currentStats.totalQuestions + 1,
    correctAnswers: currentStats.correctAnswers + (isCorrect ? 1 : 0),
    incorrectAnswers: currentStats.incorrectAnswers + (isCorrect ? 0 : 1),
    totalTimeSpent: currentStats.totalTimeSpent + timeSpent,
    lastPracticeDate: new Date().toLocaleDateString()
  };

  // Calculate accuracy
  const accuracy = (newStats.correctAnswers / newStats.totalQuestions) * 100;
  newStats.averageScore = accuracy;

  // Update streak (simplified - assumes daily practice)
  const today = new Date().toDateString();
  const lastDate = currentStats.lastPracticeDate ? new Date(currentStats.lastPracticeDate).toDateString() : '';
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (lastDate === yesterday || lastDate === today) {
    newStats.streakDays = currentStats.streakDays + (lastDate === yesterday ? 1 : 0);
  } else if (lastDate !== today) {
    newStats.streakDays = 1; // Reset streak
  }

  // Track weak and strong areas based on question patterns
  const questionType = getQuestionType(questionNumber);
  if (isCorrect) {
    if (!newStats.strongAreas.includes(questionType)) {
      newStats.strongAreas.push(questionType);
    }
    // Remove from weak areas if it was there
    newStats.weakAreas = newStats.weakAreas.filter(area => area !== questionType);
  } else {
    if (!newStats.weakAreas.includes(questionType)) {
      newStats.weakAreas.push(questionType);
    }
    // Remove from strong areas if it was there
    newStats.strongAreas = newStats.strongAreas.filter(area => area !== questionType);
  }

  // Calculate improvement rate (simplified)
  const previousAccuracy = currentStats.averageScore;
  newStats.improvementRate = accuracy - previousAccuracy;

  saveStats(newStats);
  return newStats;
};

export const startNewSession = (): PracticeStats => {
  const currentStats = loadStats();
  const newStats = {
    ...currentStats,
    totalSessions: currentStats.totalSessions + 1
  };
  saveStats(newStats);
  return newStats;
};

const getQuestionType = (questionNumber: string): string => {
  // Extract question type based on number pattern
  if (questionNumber.includes('1.1')) return 'Basic Concepts';
  if (questionNumber.includes('1.2')) return 'Transaction Analysis';
  if (questionNumber.includes('1.3')) return 'Audit & Reporting';
  if (questionNumber.includes('2.1')) return 'Stock Valuation';
  if (questionNumber.includes('2.2')) return 'Income Statement';
  if (questionNumber.includes('2.3')) return 'Retained Income';
  if (questionNumber.includes('3.1')) return 'Financial Ratios';
  if (questionNumber.includes('3.2')) return 'Cash Flow';
  if (questionNumber.includes('3.3')) return 'Cash Flow Calculations';
  if (questionNumber.includes('4.1')) return 'Advanced Topics';
  
  return 'General Accounting';
};

