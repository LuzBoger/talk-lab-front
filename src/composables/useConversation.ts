import {ref} from 'vue';
import {createConversation, resetConversation, updateConversation, publishedConversation } from '../api/conversation';
import type { Conversation } from '../types/Conversation';

export function useConversation(
  conversationId: any,
  formFields: any,
  setFieldValue: (field: any, value:any)=> void){

  const categoriesSelected = ref<number>(1);
  const status = ref<'draft' | 'published'>('draft');
  const isPublic = ref<boolean>(false);

    const conversationData = (formValues: any): Conversation => ({
      title: formValues.title,
      description: formValues.description,
      categoriesId: [categoriesSelected.value],
      creatorId: 1,
      status: 'draft',
      content: formValues.content,
      isPublic: isPublic.value,
    });

    const updatedConversationData = () : Conversation => ({
      title: formFields.title,
      description: formFields.description,
      categoriesId: [categoriesSelected.value],
      creatorId: 1,
      status: 'draft',
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

      try {
        const response = await createConversation(conversationData(formValues));
        conversationId.value = response.id;
        status.value = 'draft';
        console.log('Conversation créée:', response);
      } catch (error) {
        console.error('Erreur lors de la création conversation:', error);
      }
    };

    const saveConversationChanges = async () => {

      if (!conversationId.value) {return}

      try {
          await updateConversation(conversationId.value, updatedConversationData())
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la conversation:', error);
          }
      };

    const publishConversationToPublic = async () => {
      if (!conversationId.value) {return}

      try {
          await publishedConversation(conversationId.value, updatedConversationData())
          status.value = 'published';
          isPublic.value = true;
      } catch (error) {
        console.error('Erreur lors de la publication de la conversation:', error);
      }
    };


    const resetConversationData = async( conversationId: number | undefined) => {

      if (!conversationId) {return}
      try {
        const refreshConversationData = await resetConversation(conversationId);
        setFieldValue('title', refreshConversationData.title);
        setFieldValue('description', refreshConversationData.description);
        setFieldValue('content', refreshConversationData.content);
        status.value = refreshConversationData.status;
        isPublic.value = refreshConversationData.isPublic;
        console.log('Conversation réinitialisée:', refreshConversationData);

      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
      }
    };

    return {
      status,
      isPublic,
      categoriesSelected,
      createFakeConversation,
      saveConversationChanges,
      publishConversationToPublic,
      resetConversationData,
    }
}