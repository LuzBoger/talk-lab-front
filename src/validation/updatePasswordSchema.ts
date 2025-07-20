import * as yup from 'yup'

export const updatePasswordSchema = yup.object({
    newPassword: yup.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
                            .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre en majuscule')
                            .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre en miniscule')
                            .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
                            .matches(/[@$!%*?&]/, 'Le mot de passe doit contenir au moins un caractères spéciales')
                            .required('Le mot de passe est requis'),

    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas.')
    .required('La confirmation du mot de passe est requise.'),
})