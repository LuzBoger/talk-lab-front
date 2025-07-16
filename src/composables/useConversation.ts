import {ref} from 'vue';
import type {Ref} from 'vue';
import {createConversation, updateConversation, deleteConversation } from '../api/conversation';
import type { Conversation } from '../types/Conversation';

export function useConversation(
  conversationId: Ref<number | null>,
  formFields: any,
  setFieldValue: (field: any, value:any)=> void){

  const status = ref<'draft' | 'published'>('draft');
  const isPublic = ref<boolean>(false);

    const conversationData = (formValues: any): Conversation => ({
      title: formValues.title,
      description: formValues.description,
      categoriesId: formValues.categoriesId,
      status: status.value,
      content: formValues.content,
      isPublic: isPublic.value,
    });

    const updatedConversationData = () : Conversation => ({
      id: conversationId.value!,
      title: formFields.title,
      description: formFields.description,
      categoriesId: formFields.categoriesId.map((cat: any) => cat.id),
      status: status.value,
      content: {
        interlocutor_name: formFields.content.interlocutor_name,
        interlocutor_username: formFields.content.interlocutor_username,
        interlocutor_avatar: formFields.content.interlocutor_avatar,
        startTime: formFields.content.startTime,
        batteryLevel: formFields.content.batteryLevel,
        reseau: formFields.content.reseau,
        signal: formFields.content.signal,
        messages: formFields.content.messages,
      },
      isPublic: isPublic.value,
   });

    const createFakeConversation = async (formValues :any) => {
    
      if(!formValues.content.messages) {
        formValues.content.messages = []
      }
      try{
        const response = await createConversation(conversationData(formValues))
        return response
      } catch(error) {
        console.error('Erreur lors de la création de la conversation:', error);
      }
    };

    const saveConversationChanges = async () => {
      if (!conversationId.value) {return}

      try {
          const res = await updateConversation(conversationId.value, updatedConversationData())
          console.log('Payload envoyé au PUT:', updatedConversationData());

          return res;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la conversation:', error);
          }
      };

    const publishConversationToPublic = async () => {
      if (!conversationId.value) {console.log("erreur"); return}

      try {
          status.value = 'published'
          isPublic.value = true;

          const res = await updateConversation(conversationId.value!, updatedConversationData())
          return res
      } catch (error) {
        console.error('Erreur lors de la publication de la conversation:', error);
      }
    };

    const deleteFakeConversation = async () => {
      if(!conversationId.value) {return}

      try {
        const res = await deleteConversation(conversationId.value!)
        return res
      } catch(error) {
        console.error("Erreur de suppresion de la conversation", error)
      }
    }


    return {
      status,
      isPublic,
      createFakeConversation,
      saveConversationChanges,
      publishConversationToPublic,
      deleteFakeConversation
    }
}