export interface ConversationContent {
    interlocutor_name: string
    interlocutor_username: string
    interlocutor_avatar?: string | null
    startTime: string;
    batteryLevel: string;
    reseau: string;
    signal: string;
    messages?: {
        author: 'user' |'interlocutor';
        message: string;
        time?: string | null;
        reaction?: string | null;
    }[]
}