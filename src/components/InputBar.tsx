import { useState, useEffect, useRef } from 'react';
import { Send, SkipForward, ArrowLeft, Zap, HelpCircle, FileText, Lightbulb, Plus, FileText as FileIcon, Image, Camera } from 'lucide-react';

interface InputBarProps {
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  onBack: () => void;
  canGoBack: boolean;
  disabled?: boolean;
  showShortcuts?: boolean;
  onFileUpload?: (files: FileList) => void;
  onMicClick?: () => void;
  onOpenPDF?: () => void;
  onOpenImage?: () => void;
  onOpenCamera?: () => void;
}

export default function InputBar({ onSubmit, onSkip, onBack, canGoBack, disabled, showShortcuts = false, onFileUpload }: InputBarProps) {
  const [answer, setAnswer] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [, setKeyboardOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !disabled) {
      const trimmedAnswer = answer.trim();
      setAnswer(''); // Clear input first
      onSubmit(trimmedAnswer);
      // Ensure last message is visible after submission
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        if (messagesEnd) {
          messagesEnd.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleShortcut = (shortcut: string) => {
    if (!disabled) {
      onSubmit(shortcut);
      // Ensure last message is visible after shortcut is used
      setTimeout(() => {
        const messagesEnd = document.querySelector('[data-messages-end]');
        if (messagesEnd) {
          messagesEnd.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };


  const handlePlusClick = () => {
    if (!disabled) {
      setShowDropdown(!showDropdown);
    }
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(false);
    switch (option) {
      case 'pdf':
        // Open PDF file picker
        if (fileInputRef.current) {
          fileInputRef.current.accept = '.pdf';
          fileInputRef.current.click();
        }
        break;
      case 'image':
        // Open image file picker
        if (fileInputRef.current) {
          fileInputRef.current.accept = 'image/*';
          fileInputRef.current.click();
        }
        break;
      case 'camera':
        // Access camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
              // Camera access granted
              console.log('Camera access granted');
              // You can add camera preview functionality here
              // For now, we'll just show a message
            })
            .catch(err => {
              console.error('Camera access denied:', err);
              alert('Camera access denied. Please allow camera permission.');
            });
        } else {
          alert('Camera not supported on this device.');
        }
        break;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      // Validate file types
      const validFiles = Array.from(files).filter(file => {
        const fileType = file.type;
        const isValidImage = fileType.startsWith('image/');
        const isValidPDF = fileType === 'application/pdf';
        return isValidImage || isValidPDF;
      });

      if (validFiles.length !== files.length) {
        alert('Please select only images or PDF files.');
        return;
      }

      onFileUpload(files);
      // Reset the input
      e.target.value = '';
    }
  };


  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Mobile detection and keyboard handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Keyboard detection for mobile
    const handleKeyboardOpen = () => {
      if (isMobile) {
        setKeyboardOpen(true);
        // Add class to body for global styling
        document.body.classList.add('keyboard-open');
        // Scroll to bottom to show recent messages
        setTimeout(() => {
          const messagesEnd = document.querySelector('[data-messages-end]');
          if (messagesEnd) {
            messagesEnd.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    const handleKeyboardClose = () => {
      if (isMobile) {
        setKeyboardOpen(false);
        document.body.classList.remove('keyboard-open');
      }
    };

    // Listen for input focus/blur to detect keyboard
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleKeyboardOpen);
      input.addEventListener('blur', handleKeyboardClose);
    }

    // Visual viewport API for better keyboard detection
    if (window.visualViewport) {
      const handleViewportChange = () => {
        if (isMobile) {
          const heightDiff = window.innerHeight - (window.visualViewport?.height || window.innerHeight);
          const keyboardIsOpen = heightDiff > 150;
          setKeyboardOpen(keyboardIsOpen);
          
          if (keyboardIsOpen) {
            document.body.classList.add('keyboard-open');
            // Scroll to show recent messages when keyboard opens
            setTimeout(() => {
              const messagesEnd = document.querySelector('[data-messages-end]');
              if (messagesEnd) {
                messagesEnd.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          } else {
            document.body.classList.remove('keyboard-open');
          }
        }
      };

      window.visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
        if (input) {
          input.removeEventListener('focus', handleKeyboardOpen);
          input.removeEventListener('blur', handleKeyboardClose);
        }
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (input) {
        input.removeEventListener('focus', handleKeyboardOpen);
        input.removeEventListener('blur', handleKeyboardClose);
      }
    };
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      className={`${
        isMobile 
          ? 'mobile-keyboard-aware mobile-safe-area' 
          : 'sticky bottom-0 z-10 bg-transparent'
      } p-3 sm:p-4`}
    >
      <div className="max-w-4xl mx-auto mobile-input-container">
        {/* Floating Shortcut Buttons - Only show after first message */}
        {showShortcuts && (
          <div className="flex gap-2 sm:gap-3 mb-4 shortcut-buttons">
            <button
              type="button"
              onClick={() => handleShortcut('Simplify')}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Simplify
            </button>
            <button
              type="button"
              onClick={() => handleShortcut('Explain')}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Explain
            </button>
            <button
              type="button"
              onClick={() => handleShortcut('Summarize')}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Summarize
            </button>
            <button
              type="button"
              onClick={() => handleShortcut('Example')}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Example
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex gap-2 sm:hidden">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack || disabled}
              className="flex-1 px-3 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={onSkip}
              disabled={disabled}
              className="flex-1 px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg font-medium text-sm"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </div>

          {/* Input container with icons inside */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={disabled}
              className="w-full px-12 py-2 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-lg border-2 border-yellow-400 text-sm sm:text-base font-primary"
            />

            {/* Plus Button with Dropdown - Inside input on the left */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2" ref={dropdownRef}>
              <button
                type="button"
                onClick={handlePlusClick}
                disabled={disabled}
                className="p-1.5 text-yellow-500 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                title="Upload options"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Dropdown Menu - Positioned above */}
              {showDropdown && (
                <div className="absolute left-0 bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]">
                  <div className="py-1">
                    <button
                      onClick={() => handleOptionClick('pdf')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <FileIcon className="w-4 h-4 text-red-500" />
                      Open PDF
                    </button>
                    <button
                      onClick={() => handleOptionClick('image')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <Image className="w-4 h-4 text-blue-500" />
                      Open Image
                    </button>
                    <button
                      onClick={() => handleOptionClick('camera')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                    >
                      <Camera className="w-4 h-4 text-green-500" />
                      Open Camera
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={!canGoBack || disabled}
              className="px-4 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg font-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="submit"
              disabled={!answer.trim() || disabled}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg font-primary"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>

            <button
              type="button"
              onClick={onSkip}
              disabled={disabled}
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg font-medium font-primary"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </div>

          <button
            type="submit"
            disabled={!answer.trim() || disabled}
            className="sm:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg font-primary"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
