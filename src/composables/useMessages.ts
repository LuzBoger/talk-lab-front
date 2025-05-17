import { ref, watch} from 'vue';
import type { Ref } from 'vue';
import type { Messages } from '../types/Messages';

export function useMessages(
    message: Ref<Messages[]>,
    setFieldValue: (field: any, value:any) => void,
    getCurrentTime:() => string,
) {

    const messages = ref<Messages[]>( message.value || []);

    watch(() => message.value, (newMessages) => {
        if(newMessages) {
            messages.value = newMessages;
        }
    }
    );
    
    const sendMessage = async (
        author: 'user' | 'interlocutor',
        messageContent: string   
    ) => {

        const newMessage: Messages = {
            author,
            message: messageContent,
            time: getCurrentTime(),
            isSeen: false,
            reaction: '',
        };

        messages.value = [...messages.value, newMessage];
        setFieldValue('content.messages', messages.value);
    };

    return {
        messages,
        sendMessage,
    }


}

