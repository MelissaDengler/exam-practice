import { useState, useEffect, useRef } from 'react';
import PaperGrid from './components/PaperGrid';
import QuestionBar from './components/QuestionBar';
import ChatMessage from './components/ChatMessage';
import InputBar from './components/InputBar';
import Dashboard from './components/Dashboard';
import { PAPER_2021 } from './data/papers';
import { Message, QuestionState, Paper } from './types';
import { checkAnswer, generateHint, calculateMarks } from './utils/tutorLogic';
import { updateStats, startNewSession } from './utils/statsTracker';

function App() {
  const [activePaper, setActivePaper] = useState<Paper | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUserMessage, setHasUserMessage] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Always scroll to bottom when new messages are added
    scrollToBottom();
  }, [messages]);

  // Additional scroll behavior for better visibility
  useEffect(() => {
    const handleResize = () => {
      // Scroll to bottom on window resize to ensure last message is visible
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addMessage = (text: string, sender: 'ruby' | 'user') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Track if user has sent a message to show shortcuts
    if (sender === 'user') {
      setHasUserMessage(true);
    }
  };

  const handleSelectPaper = () => {
    setActivePaper(PAPER_2021);
    setCurrentQuestionIndex(0);
    setMessages([]);
    setHasUserMessage(false);
    setIsInitialized(false);
    setShowDashboard(false);
    
    // Start new session for stats tracking
    startNewSession();

    const initialStates = PAPER_2021.questions.map((question) => ({
      attemptsRemaining: question.maxAttempts || 5, // Use question-specific attempts or default to 5
      isCompleted: false,
      marksEarned: 0,
      isSkipped: false
    }));
    setQuestionStates(initialStates);
    setIsInitialized(true);

    setTimeout(() => {
      const firstQuestion = PAPER_2021.questions[0];
      addMessage(
        `Hi, I'm Ruby 👋 Let's tackle ${firstQuestion.questionNumber}. You have ${firstQuestion.maxMarks} mark(s) and ${firstQuestion.maxAttempts || 5} attempts. When you're ready, type your answer or Skip.`,
        'ruby'
      );
    }, 500);
  };

  const moveToNextQuestion = () => {
    if (!activePaper) return;

    if (currentQuestionIndex < activePaper.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = activePaper.questions[nextIndex];
      setMessages([]);
      setHasUserMessage(false); // Reset shortcuts for new question
      setIsInitialized(true); // Ensure we're ready for the next question

      setTimeout(() => {
        addMessage(
          `Let's move to ${nextQuestion.questionNumber}. You have ${nextQuestion.maxMarks} mark(s) and ${nextQuestion.maxAttempts || 5} attempts. Type your answer when ready.`,
          'ruby'
        );
      }, 1000);
    } else {
      const totalMarks = questionStates.reduce((sum, state) => sum + state.marksEarned, 0);
      const maxPossibleMarks = activePaper.questions.reduce((sum, q) => sum + q.maxMarks, 0);
      const completedCount = questionStates.filter(s => s.isCompleted && !s.isSkipped).length;

      setTimeout(() => {
        addMessage(
          `Well done! You've completed the paper. Total: ${totalMarks}/${maxPossibleMarks} marks. Questions answered: ${completedCount}/${activePaper.questions.length}.`,
          'ruby'
        );
      }, 1000);
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    console.log('handleSubmitAnswer called with:', answer);
    console.log('activePaper:', !!activePaper);
    console.log('isProcessing:', isProcessing);
    console.log('isInitialized:', isInitialized);
    console.log('questionStates length:', questionStates?.length);
    console.log('currentQuestionIndex:', currentQuestionIndex);
    
    if (!activePaper || isProcessing || !isInitialized) {
      console.log('Early return: not ready for submission');
      return;
    }

    // Check if questionStates is properly initialized
    if (!questionStates || questionStates.length === 0) {
      console.log('Early return: questionStates not initialized');
      return;
    }

    setIsProcessing(true);
    const currentQuestion = activePaper.questions[currentQuestionIndex];
    const currentState = questionStates[currentQuestionIndex];

    console.log('currentQuestion:', currentQuestion);
    console.log('currentState:', currentState);

    if (!currentState) {
      console.log('Early return: no currentState');
      setIsProcessing(false);
      return;
    }

    if (currentState.isCompleted) {
      console.log('Early return: question already completed');
      setIsProcessing(false);
      return;
    }

    // Check if this is a shortcut response (not a regular answer)
    const isShortcut = ['Simplify', 'Explain', 'Summarize', 'Example'].includes(answer);
    
    addMessage(answer, 'user');

    if (isShortcut) {
      // Handle shortcut responses - don't subtract attempts, just provide helpful response
      setTimeout(() => {
        let response = '';
        switch (answer) {
          case 'Simplify':
            response = `Let me simplify this question: ${currentQuestion.questionText}. Focus on the key concepts and break it down into smaller parts.`;
            break;
          case 'Explain':
            response = `Here's an explanation: ${currentQuestion.solutionDetails.explanation}. This should help you understand the approach to solve this question.`;
            break;
          case 'Summarize':
            response = `Summary: This question asks you to ${currentQuestion.questionText}. The key points to remember are the main concepts involved.`;
            break;
          case 'Example':
            response = `Here's an example approach: ${currentQuestion.solutionDetails.explanation}. Try to apply similar reasoning to your answer.`;
            break;
          default:
            response = `I'm here to help! What specific aspect of this question would you like me to clarify?`;
        }
        
        addMessage(response, 'ruby');
        setIsProcessing(false);
      }, 800);
    } else {
      // Handle regular answer submission
      setTimeout(() => {
        const isCorrect = checkAnswer(
          answer,
          currentQuestion.solutionDetails.correctAnswer,
          currentQuestion.isLongAnswer
        );

        if (isCorrect) {
          const attemptsUsed = 6 - currentState.attemptsRemaining;
          const marks = calculateMarks(true, attemptsUsed, currentQuestion.maxMarks);

          const updatedStates = [...questionStates];
          updatedStates[currentQuestionIndex] = {
            ...currentState,
            isCompleted: true,
            marksEarned: marks
          };
          setQuestionStates(updatedStates);

          // Track stats for correct answer
          updateStats(true, currentQuestion.questionNumber, 1);

          addMessage(
            `✅ Correct! Well done. You earned ${marks}/${currentQuestion.maxMarks} mark(s).`,
            'ruby'
          );

          setIsProcessing(false);
          setTimeout(() => {
            moveToNextQuestion();
          }, 3000); // 3 seconds to review the answer
        } else {
          const newAttemptsRemaining = currentState.attemptsRemaining - 1;

          if (newAttemptsRemaining === 0) {
            const updatedStates = [...questionStates];
            updatedStates[currentQuestionIndex] = {
              ...currentState,
              isCompleted: true,
              attemptsRemaining: 0,
              marksEarned: 0
            };
            setQuestionStates(updatedStates);

            addMessage(
              `❌ No attempts left. The correct answer is: ${currentQuestion.solutionDetails.correctAnswer}. ${currentQuestion.solutionDetails.explanation} (0 marks)`,
              'ruby'
            );

            // Track stats for incorrect answer
            updateStats(false, currentQuestion.questionNumber, 1);

            setIsProcessing(false);
            setTimeout(() => {
              moveToNextQuestion();
            }, 4000); // 4 seconds to review the answer and explanation
          } else {
            const updatedStates = [...questionStates];
            updatedStates[currentQuestionIndex] = {
              ...currentState,
              attemptsRemaining: newAttemptsRemaining
            };
            setQuestionStates(updatedStates);

            const hint = generateHint(currentQuestion, newAttemptsRemaining);
            addMessage(`❌ Try again. ${hint}`, 'ruby');
            setIsProcessing(false);
          }
        }
      }, 800);
    }
  };

  const handleSkip = () => {
    if (!activePaper || isProcessing) return;

    setIsProcessing(true);
    const currentState = questionStates[currentQuestionIndex];

    if (currentState.isCompleted) {
      setIsProcessing(false);
      return;
    }

    const updatedStates = [...questionStates];
    updatedStates[currentQuestionIndex] = {
      ...currentState,
      isCompleted: false,
      isSkipped: true,
      marksEarned: 0,
      attemptsRemaining: 5
    };
    setQuestionStates(updatedStates);

    addMessage(
      `Skipped. Come back to this question later using the Back button.`,
      'ruby'
    );

    setIsProcessing(false);
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleBack = () => {
    if (!isProcessing) {
      if (currentQuestionIndex > 0) {
        // Go to previous question
        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        setMessages([]);
        setHasUserMessage(false); // Reset shortcuts when going back
        setTimeout(() => {
          addMessage(`Back to ${activePaper?.questions[prevIndex].questionNumber}. You have ${activePaper?.questions[prevIndex].maxAttempts || 5} attempts. Type your answer when ready.`, 'ruby');
        }, 300);
      } else {
        // Go back to landing page (PaperGrid)
        setActivePaper(null);
        setCurrentQuestionIndex(0);
        setMessages([]);
        setHasUserMessage(false);
        setIsInitialized(false);
        setShowDashboard(false);
      }
    }
  };

  const handleFileUpload = (files: FileList) => {
    // Handle file uploads here
    console.log('Files uploaded:', files);
    
    // Check if it's a voice recording
    const firstFile = files[0];
    if (firstFile && firstFile.type.startsWith('audio/')) {
      addMessage(`Voice note recorded! (${Math.round(firstFile.size / 1024)}KB)`, 'ruby');
    } else {
      addMessage(`Uploaded ${files.length} file(s). File upload functionality can be implemented here.`, 'ruby');
    }
  };



  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackFromDashboard = () => {
    setShowDashboard(false);
  };

  if (showDashboard) {
    return <Dashboard onBack={handleBackFromDashboard} />;
  }

  if (!activePaper) {
    return <PaperGrid onSelectPaper={handleSelectPaper} onShowDashboard={handleShowDashboard} />;
  }

  const currentQuestion = activePaper.questions[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col font-primary">
      <QuestionBar
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={activePaper.questions.length}
        attemptsRemaining={currentState.attemptsRemaining}
        paperTitle="Accounting Paper 1 - Nov"
      />

      <div className="flex-1 p-3 sm:p-4 lg:p-6 main-content" style={{ paddingBottom: '120px' }}>
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} data-messages-end />
        </div>
      </div>

      <InputBar
        onSubmit={handleSubmitAnswer}
        onSkip={handleSkip}
        onBack={handleBack}
        canGoBack={true}
        disabled={isProcessing || !isInitialized}
        showShortcuts={hasUserMessage}
        onFileUpload={handleFileUpload}
      />

    </div>
  );
}

export default App;
