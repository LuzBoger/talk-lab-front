import * as yup from 'yup';

export const conversationSchema = yup.object({
    title: yup.string().required('Veuillez saisir un titre pour votre conversation'),
    description: yup.string().optional(),
    category_id: yup.array().of(yup.number().required()).min(1),
    creator_id: yup.number().required(),
    status: yup.string().oneOf(['draft', 'published']).required(),
    isPublic: yup.boolean().required(),
    content: yup.object({
        interlocutor_name: yup.string().required('Veuillez définir le nom de votre interlocuteur'),
        interlocutor_username: yup.string().required('Veuillez définir le nom d\'utilisateur de votre interlocuteur'),
        interlocutor_avatar: yup.string().url('Veuillez saisir une URL pour l\'avatar de votre interlocuteur').notRequired(),
        startTime: yup.string().required('Veuillez définir une heure pour votre conversation'),
        batteryLevel: yup.number().min(1).max(100).required(),
        reseau: yup.string().required('Veuillez définir le réseau utilisé').required(),
        signal: yup.number().min(1).max(4).required(),
        messages: yup.array().of(
            yup.object({
                author: yup.string().oneOf(['user', 'interlocutor']).required('Veuillez définir l\'auteur du message'),
                message: yup.string().required('Veuillez définir le message'),
                time: yup.string().notRequired(),
                isSeen: yup.boolean().notRequired(),
                reaction: yup.string().notRequired(),

            })
        ).required()
    })
});