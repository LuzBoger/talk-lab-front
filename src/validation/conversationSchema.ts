import * as yup from 'yup'

export const conversationSchema = yup.object({
  title: yup
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .required('Veuillez saisir un titre pour votre conversation'),
  description: yup.string().required(),
  categoriesId: yup.array().of(yup.number().required()).min(1),
  status: yup.string().oneOf(['draft', 'published']).required(),
  isPublic: yup.boolean().required(),
  content: yup.object({
    interlocutor_name: yup
      .string()
      .required('Veuillez définir le nom de votre interlocuteur'),
    interlocutor_username: yup
      .string()
      .required("Veuillez définir le nom d'utilisateur de votre interlocuteur"),
    interlocutor_avatar: yup
      .string()
      .url("Veuillez saisir une URL pour l'avatar de votre interlocuteur")
      .required(),
    startTime: yup
      .string()
      .required('Veuillez définir une heure pour votre conversation'),
    batteryLevel: yup.string().required(),
    reseau: yup.string().required('Veuillez définir le réseau utilisé'),
    signal: yup.string().required('Veuillez définir le signal utilisé'),
    messages: yup
      .array()
      .of(
        yup.object({
          author: yup
            .string()
            .oneOf(['user', 'interlocutor'])
            .required("Veuillez définir l'auteur du message"),
          message: yup.string().notRequired(),
          time: yup.string().notRequired(),
          isSeen: yup.boolean().notRequired(),
          reaction: yup.string().notRequired(),
          image: yup.string().notRequired(),
          audio: yup.string().notRequired(),
        }),
      )
      .min(1, 'Veuillez ajouter au moins un message')
      .required(),
  }),
})
