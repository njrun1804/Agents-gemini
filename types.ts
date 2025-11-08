
// FIX: Import ComponentType to be used in the Agent interface.
import type { ComponentType } from 'react';

export enum AgentType {
    SocraticInterrogator = 'SocraticInterrogator',
    RedTeam = 'RedTeam',
    StakeholderSimulation = 'StakeholderSimulation',
    ConsequenceModeler = 'ConsequenceModeler',
    PreMortemFacilitator = 'PreMortemFacilitator'
}

export enum StakeholderPersona {
    Executive = 'Executive',
    Customer = 'Customer'
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    agent?: AgentType;
    persona?: StakeholderPersona;
}

export interface Agent {
    id: AgentType;
    name: string;
    description: string;
    // FIX: Use ComponentType directly instead of React.ComponentType.
    icon: ComponentType<{ className?: string }>;
}
