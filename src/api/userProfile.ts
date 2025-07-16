import { apiClient } from "../utils/apiClient"

export const updateUserProfile = async (form: FormData) : Promise<any> => {
    const response = await apiClient.post('/user/profile/edit', form, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
     return response.data
}

