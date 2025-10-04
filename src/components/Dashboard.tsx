import { useState, useEffect } from 'react';
import { BarChart3, Target, TrendingUp, Clock, Award, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  onBack: () => void;
}

interface PracticeStats {
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

export default function Dashboard({ onBack }: DashboardProps) {
  const [stats, setStats] = useState<PracticeStats>({
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

  // Load stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('ruby-practice-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0;
  const totalMarks = stats.correctAnswers + stats.incorrectAnswers;

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-shrink-0">
        <div className="text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
            <img 
              src="/images/logos/rubysmall.svg" 
              alt="Ruby Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-4 sm:mb-6 px-2 font-primary-bold drop-shadow-lg">
            Learning Dashboard
          </h1>
          <div className="w-24 h-0.5 bg-white/60 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-blue-100 px-2 font-primary">Track your progress and improve your performance</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 bg-blue-700 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-primary"
            >
              ← Back to Papers
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Practice Sessions */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Practice Sessions</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.totalSessions}</div>
              <p className="text-blue-200 text-sm">Total study sessions completed</p>
            </div>

            {/* Accuracy Rate */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Accuracy Rate</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">{accuracy.toFixed(1)}%</div>
              <p className="text-blue-200 text-sm">Overall correct answers</p>
            </div>

            {/* Questions Answered */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Questions</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalQuestions}</div>
              <p className="text-blue-200 text-sm">Total questions attempted</p>
            </div>

            {/* Study Time */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Study Time</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalTimeSpent}m</div>
              <p className="text-blue-200 text-sm">Total time spent studying</p>
            </div>

            {/* Current Streak */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-orange-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Streak</h3>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">{stats.streakDays}</div>
              <p className="text-blue-200 text-sm">Days of consecutive practice</p>
            </div>

            {/* Average Score */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white font-primary-bold">Average Score</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.averageScore.toFixed(1)}%</div>
              <p className="text-blue-200 text-sm">Average performance per session</p>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Correct vs Incorrect */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white font-primary-bold mb-6">Answer Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-white font-primary">Correct Answers</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{stats.correctAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <span className="text-white font-primary">Incorrect Answers</span>
                  </div>
                  <span className="text-2xl font-bold text-red-400">{stats.incorrectAnswers}</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-3 mt-4">
                  <div 
                    className="bg-green-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Learning Insights */}
            <div className="bg-blue-600/50 rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold text-white font-primary-bold mb-6">Learning Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-white font-primary">Improvement Rate: {stats.improvementRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <span className="text-white font-primary">Last Practice: {stats.lastPracticeDate || 'Never'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <span className="text-white font-primary">Best Streak: {stats.streakDays} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Weak Areas */}
            <div className="bg-red-600/20 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-xl font-bold text-white font-primary-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                Areas to Focus On
              </h3>
              <div className="space-y-2">
                {stats.weakAreas.length > 0 ? (
                  stats.weakAreas.map((area, index) => (
                    <div key={index} className="text-red-300 font-primary">• {area}</div>
                  ))
                ) : (
                  <div className="text-red-300 font-primary">No weak areas identified yet</div>
                )}
              </div>
            </div>

            {/* Strong Areas */}
            <div className="bg-green-600/20 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-white font-primary-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Your Strengths
              </h3>
              <div className="space-y-2">
                {stats.strongAreas.length > 0 ? (
                  stats.strongAreas.map((area, index) => (
                    <div key={index} className="text-green-300 font-primary">• {area}</div>
                  ))
                ) : (
                  <div className="text-green-300 font-primary">Keep practicing to identify strengths!</div>
                )}
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-8 text-center">
            <div className="bg-yellow-400/20 rounded-xl p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-yellow-400 font-primary-bold mb-2">
                Keep Up the Great Work! 🎯
              </h3>
              <p className="text-yellow-200 font-primary">
                Every question you answer brings you closer to exam success. Stay consistent and track your progress!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

