import { User } from '@supabase/supabase-js'

export interface RewardValue {
    id: number
    category: string
    value: number
    type: string
}

export interface UserOwnedCard {
    id: number
    user_id: string
    card_name: string
    issuer: string
    credit_limit?: number
    used_amount?: number
    rewards: RewardValue[]
}

export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export interface DashboardViewProps {
    user: User | null
    setActiveView: (view: string) => void
    onAddCardClick: () => void
}

export interface SidebarProps {
    activeView: string
    setActiveView: (view: string) => void
    user: User | null
    onAuthClick: () => void
    theme: string
    toggleTheme: () => void
    onLinkClick: () => void
}