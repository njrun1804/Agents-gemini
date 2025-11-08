
import React, { useState, useRef, useEffect } from 'react';

interface InputFormProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading, disabled = false }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isLoading && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };
    
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [message]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }
    
    const placeholderText = disabled ? "Please select a persona above to begin." : "Enter your idea to pressure-test...";

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-gray-800 p-2 rounded-xl border border-gray-700 shadow-inner">
            <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                rows={1}
                className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-40 p-2"
                disabled={isLoading || disabled}
            />
            <button
                type="submit"
                disabled={isLoading || !message.trim() || disabled}
                className="bg-indigo-600 text-white rounded-lg p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
            </button>
        </form>
    );
};

export default InputForm;
