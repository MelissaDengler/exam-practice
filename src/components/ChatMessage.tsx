import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.sender === 'ruby') {
    return (
      <div className="flex justify-start mb-4">
        <div className="flex items-start gap-3">
          <img 
            src="/images/icons/rubyIcon.svg" 
            alt="Ruby AI" 
            className="w-8 h-8 flex-shrink-0 mt-1"
          />
          <div className="max-w-xs sm:max-w-md lg:max-w-3xl">
            <p className="text-white font-bold text-sm sm:text-base lg:text-lg leading-relaxed font-primary-bold">{message.text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-xs sm:max-w-md">
        <div className="bg-blue-600 text-white rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-md">
          <p className="leading-relaxed text-sm sm:text-base font-primary">{message.text}</p>
        </div>
      </div>
    </div>
  );
}
