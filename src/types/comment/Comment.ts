import type { CommentStatusEnum } from "../../enums/CommentStatusEnum";
import type { User } from "../User"

export interface Comment {
    id?: number;
    content: string;
    conversationId: number;
    status: CommentStatusEnum;
    publisher: User;
    parentCommentId?: number;
    childComments?: Comment[];
    createdAt?: string
}