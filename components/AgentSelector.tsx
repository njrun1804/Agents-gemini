
import React from 'react';
import type { Agent } from '../types';

interface AgentSelectorProps {
    agents: Agent[];
    selectedAgent: Agent;
    onSelectAgent: (agent: Agent) => void;
}

const AgentCard: React.FC<{ agent: Agent; isSelected: boolean; onSelect: () => void }> = ({ agent, isSelected, onSelect }) => {
    const baseClasses = "flex flex-col items-center text-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1";
    const selectedClasses = "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/10";
    const unselectedClasses = "bg-gray-800 border-gray-700 hover:border-indigo-500";

    return (
        <div onClick={onSelect} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <agent.icon className={`w-7 h-7 mb-2 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
            <h3 className="font-semibold text-sm text-gray-100">{agent.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{agent.description}</p>
        </div>
    );
};

const AgentSelector: React.FC<AgentSelectorProps> = ({ agents, selectedAgent, onSelectAgent }) => {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-semibold text-center mb-4 text-gray-300">Choose Your Cognitive Partner</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {agents.map(agent => (
                    <AgentCard 
                        key={agent.id}
                        agent={agent}
                        isSelected={selectedAgent.id === agent.id}
                        onSelect={() => onSelectAgent(agent)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgentSelector;
