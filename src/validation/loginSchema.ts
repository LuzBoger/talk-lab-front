import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string()
    .email('Adresse e-mail invalide.')
    .required('L\'adresse e-mail est requise.'),
    
  password: yup.string()
    .required('Le mot de passe est requis.'),
});
