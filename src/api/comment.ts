import type { Comment } from "../types/Comment";
import type { CommentCreation } from "../types/CommentCreation";
import { apiClient } from "../utils/apiClient";



export const addComment = async(comment:CommentCreation) => {
    const response = await apiClient.post('/add-comment', comment);
    return response.data
}


export const fetchCommentsByConversationId = async (conversationId: number): Promise<Comment[]> => {
  const response = await apiClient.get(`/conversations/${conversationId}/comments`)
  return response.data
}

export const editComment = async(commentId: number, comment:Comment) : Promise<Comment> => {
    const response = await apiClient.put(`/edit-comment/${commentId}`, comment);
    return response.data
}

export const deleteComment = async(commentId: number) : Promise<void> => {
    await apiClient.delete(`/delete-comment/${commentId}`);
}

export const reportComment = async (commentId: number) : Promise<void> => {
    await apiClient.post(`/report-comment/${commentId}`)
}

export const getPendingComments = async (): Promise<Comment[]> => {
const response = await apiClient.get('/pending-comment')
    return response.data
}