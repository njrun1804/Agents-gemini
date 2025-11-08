
import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatWindowProps {
    chatHistory: ChatMessage[];
    isLoading: boolean;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center font-bold">
        U
    </div>
);

const ModelIcon = () => (
     <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
    </div>
);


const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const bubbleClasses = isUser 
        ? "bg-sky-600/30 text-sky-100" 
        : "bg-gray-700/50 text-gray-200";

    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? "flex-row-reverse" : ""}`}>
            {isUser ? <UserIcon /> : <ModelIcon />}
            <div className={`p-4 rounded-lg max-w-lg lg:max-w-2xl ${bubbleClasses}`}>
                 <article className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:bg-gray-800/50 prose-pre:p-2">
                    {message.content}
                </article>
            </div>
        </div>
    );
};

const LoadingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 my-4">
        <ModelIcon />
        <div className="p-4 rounded-lg max-w-sm bg-gray-700/50">
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);

    const hasMessages = chatHistory.length > 0;

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-800/30 rounded-lg my-4">
            {!hasMessages && !isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Select an agent and start the conversation.</p>
                </div>
            )}
            {chatHistory.map((msg, index) => (
                <ChatBubble key={index} message={msg} />
            ))}
            {isLoading && <LoadingIndicator />}
        </div>
    );
};

export default ChatWindow;
