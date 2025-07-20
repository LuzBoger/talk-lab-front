import * as yup from 'yup'

export const registerSchema = yup.object({
  name: yup.string().required('Le nom est requis.'),

  username: yup.string().required('Username est requis'),

  email: yup
    .string()
    .email('Adresse e-mail invalide.')
    .required("L'adresse e-mail est requise."),

  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
    .matches(
      /[A-Z]/,
      'Le mot de passe doit contenir au moins une lettre majuscule.',
    )
    .matches(
      /[a-z]/,
      'Le mot de passe doit contenir au moins une lettre minuscule.',
    )
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre.')
    .matches(
      /[@$!%*?&]/,
      'Le mot de passe doit contenir au moins un caractère spécial (@, $, !, %, *, ?, &).',
    )
    .required('Le mot de passe est requis.'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas.')
    .required('La confirmation du mot de passe est requise.'),
})
