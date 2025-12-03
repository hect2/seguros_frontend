export interface AddFollowUpDto {
  id_incident: number;
  id_message_reply?: number;
  id_user: number;
  message: string;
  attachments?: { name: string; file: string }[];
  status_id?: number | null;
}
