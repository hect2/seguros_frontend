export interface MessagesResponse {
    error: boolean;
    data:  Messages[];
}

export interface Messages {
    id:               number;
    id_message_reply: number | null;
    id_incident:      number;
    id_user:          number;
    message:          string;
    attachments:      Attachment[];
    created_at:       Date;
    updated_at:       Date;
    replies?:         Messages[];
}

export interface Attachment {
    url:         string;
    path:        string;
    uuid:        string;
    filename:    string;
    mime_type:   string;
    size_bytes:  number;
    uploaded_at: Date;
}
