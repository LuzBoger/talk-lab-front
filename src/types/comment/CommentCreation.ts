import type { CommentStatusEnum } from "../../enums/CommentStatusEnum";

export interface CommentCreation {
  content: string;
  conversationId: number;
  status: CommentStatusEnum;
  parentCommentId?: number | null;
}
