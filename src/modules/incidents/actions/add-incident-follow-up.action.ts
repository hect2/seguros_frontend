import { api } from "@/api/api";
import { AddFollowUpDto } from "../interfaces/add-follow-up.dto";

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const addIncidentFollowUpAction = async (dto: AddFollowUpDto) => {
  console.log(dto)

  const payload = {
    id_incident: dto.id_incident,
    id_user: dto.id_user, // asegúrate de que AddFollowUpDto tenga user_id
    message: dto.message,
    attachments: dto.attachments,
    status_id: dto.status_id,
    id_message_reply: dto.id_message_reply,
    // assigned_user_id: dto.assigned_user_id,
    // follow_up_date: dto.follow_up_date,
  };
  console.log(payload);
  const { data } = await api.post("/incidents/messages", payload);
  return data;
};
