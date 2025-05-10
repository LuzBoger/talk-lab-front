export interface ConversationContent {
    interlocutor_name: string
    interlocutor_username: string
    interlocutor_avatar: string
    startTime: string;
    batteryLevel: number;
    reseau: string;
    signal: number;
    messages?: {
        author: string;
        message: string;
    }[]
}