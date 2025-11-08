
// FIX: Corrected React import syntax and consolidated multiple imports.
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Agent, ChatMessage } from './types';
import { AgentType, StakeholderPersona } from './types';
import { AGENTS } from './constants';
import { generateResponse } from './services/geminiService';

import AgentSelector from './components/AgentSelector';
import ChatWindow from './components/ChatWindow';
import InputForm from './components/InputForm';

const App: React.FC = () => {
    const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
    const [selectedPersona, setSelectedPersona] = useState<StakeholderPersona | undefined>(undefined);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectAgent = useCallback((agent: Agent) => {
        setSelectedAgent(agent);
        setSelectedPersona(undefined);
        setChatHistory([]);
        setError(null);
    }, []);
    
    const handleSendMessage = useCallback(async (message: string) => {
        setIsLoading(true);
        setError(null);
        
        const userMessage: ChatMessage = { role: 'user', content: message, agent: selectedAgent.id, persona: selectedPersona };
        setChatHistory(prev => [...prev, userMessage]);

        try {
            // Format chat history for Gemini API
            const formattedHistory = chatHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })) as { role: 'user' | 'model', parts: { text: string }[] }[];

            const response = await generateResponse(message, selectedAgent.id, selectedPersona, formattedHistory);
            const modelMessage: ChatMessage = { role: 'model', content: response, agent: selectedAgent.id, persona: selectedPersona };
            setChatHistory(prev => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            const modelMessage: ChatMessage = { role: 'model', content: `Error: ${errorMessage}` };
            setChatHistory(prev => [...prev, modelMessage]);
        } finally {
            setIsLoading(false);
        }

    }, [selectedAgent, selectedPersona, chatHistory]);

    return (
        <div className="flex flex-col h-screen font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg sticky top-0 z-10">
                <h1 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">
                    AI Cognitive Partner
                </h1>
            </header>

            <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                <AgentSelector
                    agents={AGENTS}
                    selectedAgent={selectedAgent}
                    onSelectAgent={handleSelectAgent}
                />
                
                {selectedAgent.id === AgentType.StakeholderSimulation && (
                     <div className="flex justify-center items-center gap-4 my-4">
                        <span className="text-sm font-medium text-gray-400">Select Persona:</span>
                        <button 
                            onClick={() => setSelectedPersona(StakeholderPersona.Executive)}
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedPersona === StakeholderPersona.Executive ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Executive
                        </button>
                        <button 
                            onClick={() => setSelectedPersona(StakeholderPersona.Customer)}
                            className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedPersona === StakeholderPersona.Customer ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            Customer
                        </button>
                    </div>
                )}

                <ChatWindow chatHistory={chatHistory} isLoading={isLoading} />
            </main>

            <footer className="p-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0 border-t border-gray-700">
                 {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
                <InputForm onSendMessage={handleSendMessage} isLoading={isLoading} disabled={selectedAgent.id === AgentType.StakeholderSimulation && !selectedPersona}/>
            </footer>
        </div>
    );
};

export default App;
