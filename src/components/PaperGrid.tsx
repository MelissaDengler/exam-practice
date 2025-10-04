import { useState } from 'react';
import { FileText, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';

interface PaperGridProps {
  onSelectPaper: () => void;
  onShowDashboard: () => void;
}

export default function PaperGrid({ onSelectPaper, onShowDashboard }: PaperGridProps) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([2024, 2023, 2022])); // All expanded by default

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  const years = [
    { 
      year: 2024, 
      papers: [
        'Accounting Paper 1 - May-June',
        'Accounting Paper 1 - Nov', 
        'Accounting Paper 2 - May-June',
        'Accounting Paper 2 - Nov'
      ] 
    },
    { 
      year: 2023, 
      papers: [
        'Accounting Paper 1 - May-June',
        'Accounting Paper 1 - Nov',
        'Accounting Paper 2 - May-June', 
        'Accounting Paper 2 - Nov'
      ] 
    },
    { 
      year: 2022, 
      papers: [
        'Accounting Paper 1 - May-June',
        'Accounting Paper 1 - Nov',
        'Accounting Paper 2 - May-June',
        'Accounting Paper 2 - Nov'
      ] 
    }
  ];

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-blue-500 px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-shrink-0">
        <div className="text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
            <img 
              src="/images/logos/rubysmall.svg" 
              alt="Ruby Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-4 sm:mb-6 px-2 font-primary-bold drop-shadow-lg">Accounting Past Exam Papers</h1>
          <div className="w-24 h-0.5 bg-white/60 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-lg sm:text-xl text-blue-100 px-2 font-primary mb-6">Select an Exam to start Learning</p>
          
          {/* Dashboard Button */}
          <button
            onClick={onShowDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold transition-colors font-primary"
          >
            📊 View Learning Dashboard
          </button>
        </div>
      </div>

      {/* Papers List Section */}
      <div className="flex-1 bg-blue-700 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {years.map((yearData) => (
            <div key={yearData.year} className="mb-6 sm:mb-8">
              {/* Year Header */}
              <div className="flex items-center justify-center mb-3 sm:mb-4 relative px-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-primary-bold">{yearData.year}</h2>
                  <span className="bg-yellow-400 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {yearData.papers.length} papers
                  </span>
                </div>
                <button
                  onClick={() => toggleYear(yearData.year)}
                  className="absolute right-2 sm:right-0 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {expandedYears.has(yearData.year) ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  )}
                </button>
              </div>

              {/* Papers List */}
              {expandedYears.has(yearData.year) && (
                <div className="space-y-2 sm:space-y-3">
                  {yearData.papers.map((paper, index) => (
                    <button
                      key={index}
                      onClick={() => onSelectPaper()}
                      className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg p-3 sm:p-4 flex items-center justify-between transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                        <span className="text-white font-medium text-sm sm:text-base truncate font-primary">{paper}</span>
                      </div>
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 group-hover:text-green-300 flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
