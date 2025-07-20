import type { PasswordPayload } from "../types/updateProfil/PasswordPaylaod"
import { apiClient } from "../utils/apiClient"

export const updateUserProfile = async (form: FormData) : Promise<any> => {
    const response = await apiClient.post('/user/profile/edit', form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
     return response.data
}

export const updateUserPassword = async (payload: PasswordPayload): Promise<any> => {
    const response = await apiClient.put('/user/profile/password/update', payload)
    return response.data
}

