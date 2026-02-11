import React, { useEffect, useState, useRef } from 'react';
import { X, Clock, User, Hash, Paperclip, Send, UserPlus, Calendar, MapPin, FileText } from 'lucide-react';
import { Incident } from '@/modules/incidents/interfaces/incident.response';
import { CustomFullScreenLoading } from '../../../components/custom/CustomFullScreenLoading';
import { getCriticalityColor } from '@/utils/criticality';
import { getStatusColor } from '@/utils/incident_status';
import { useAuthStore } from '@/auth/store/auth.store';
import { getInitials } from '@/utils/user_initials';
import { useIncident } from '../hooks/useIncident';
import { useIncidentFollowUps } from '../hooks/useIncidentFollowUps';
import { useUsersList } from '@/seguros/hooks/useUsersList';
import { AssignUserPopover } from './AssignUserPopover';
import { ScheduleFollowUpPopover } from './ScheduleFollowUpPopover';
import { buildFileUrl } from '@/utils/build_file_url';
import { AddFollowUpDto } from '../interfaces/add-follow-up.dto';
import { useIncidentStatusList } from '@/seguros/hooks/useIncidentStatusList';
import { Messages } from '../interfaces/messages.response';
import { UserListResponse } from '@/interfaces/user.lists.response';

interface DetalleNovedadModalProps {
  id: number;
  onClose: () => void;
}


interface TimelineItemProps {
  messageData: Messages;
  usersMap: UserListResponse; // Para mapear id_user a info real
  type?: "comment" | "status" | "system";
  idIncident: number; // para enviar a la API
  onAddReply: (payload: AddFollowUpDto) => void; // callback para crear reply
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};


const downloadFile = async (module: string, id: number, filename: string) => {

  const url = buildFileUrl(module, String(id), filename);

  const authToken = localStorage.getItem("token");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    console.error("Error descargando archivo");
    return;
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(downloadUrl);
}
function TimelineItem({ messageData, usersMap, type = "comment", idIncident, onAddReply }: TimelineItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplyId, setShowReplyId] = useState<number>();
  const [replyText, setReplyText] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user: CurrentUser } = useAuthStore();

  const user = usersMap.data?.find(item => item.id === messageData.id_user)
    || { name: `Usuario ${messageData.id_user}` }; // fallback si no se encuentra

  // const user = usersMap[messageData.id_user] || { nombre: `Usuario ${messageData.id_user}`, rol: "Usuario" };

  const getTypeStyles = () => (type === "status" || type === "system" ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200");

  const getTypeIcon = () => {
    if (type === "status" || type === "system") {
      return (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">{getInitials(user.name)}</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cf2e2e] to-[#b52626] flex items-center justify-center">
        <span className="text-white font-semibold text-sm">{getInitials(user.name)}</span>
      </div>
    );
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };
  const handleReplySubmit = async () => {
    if (!replyText.trim() && replyFiles.length === 0) return;

    const filesPayload = await Promise.all(
      replyFiles.map(async (file) => ({
        name: file.name,
        file: await convertFileToBase64(file),
      }))
    );

    const payload: AddFollowUpDto = {
      id_incident: idIncident,
      id_user: Number(CurrentUser?.id), // acá puedes pasar el user actual desde context/store si lo quieres
      message: replyText.trim(),
      attachments: filesPayload,
      id_message_reply: Number(showReplyId), // <-- importante: link al mensaje padre
      status_id: null, // opcional: status si quieres cambiarlo
    };

    onAddReply(payload);

    setReplyText("");
    setReplyFiles([]);
    setShowReplyForm(false);
    setShowReplyId(0);
  };

  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setReplyFiles((prev) => [...prev, ...Array.from(event.target.files)]);
  };
  const removeFile = (index: number) => setReplyFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className={`rounded-2xl border p-4 ${getTypeStyles()}`}>
        <div className="flex items-start space-x-3">
          {getTypeIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{user.role_id}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{new Date(messageData.created_at).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{messageData.message}</p>

            {messageData.attachments.length > 0 &&
              messageData.attachments.map((file) => (
                <button
                  key={file.uuid}
                  onClick={() => downloadFile("messages", messageData.id, file.filename)}
                  className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <FileText size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 font-medium truncate hover:underline">{file.filename}</p>
                    <p className="text-xs text-gray-500">{(file.size_bytes / 1024).toFixed(1)} KB</p>
                  </div>
                </button>
              ))}

            {type === "comment" && (
              <button
                onClick={() => {
                  setShowReplyForm(!showReplyForm)
                  setShowReplyId(messageData.id)
                }}
                className="mt-2 text-xs text-[#cf2e2e] hover:text-[#b52626] font-medium"
              >
                ← Responder
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-12 border-l-2 border-gray-200 pl-4">
          <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escribe una respuesta..."
              rows={2}
              className="w-full text-sm border-0 focus:ring-0 resize-none"
            />
            {replyFiles.length > 0 && (
              <div className="space-y-1">
                {replyFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm">
                    <span className="text-gray-700 truncate">{file.name}</span>
                    <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button onClick={handleAttachClick} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Paperclip size={16} />
                <span>Adjuntar</span>
              </button>
              <button
                onClick={handleReplySubmit}
                className="flex items-center space-x-2 bg-[#cf2e2e] text-white px-4 py-1.5 rounded-lg hover:bg-[#b52626] transition-colors text-sm"
              >
                <Send size={14} />
                <span>Responder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {messageData.replies && messageData.replies.length > 0 && (
        <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-4">
          {messageData.replies.map((reply) => (
            <TimelineItem
              key={reply.id}
              messageData={reply}
              usersMap={usersMap}
              type="comment"
              idIncident={idIncident}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MetaInfoCard({
  novedad,
  onAssignUser,
  users,
  isUsersLoading,
  onScheduleFollowUp,
}: {
  novedad: Incident;
  onAssignUser: (userId: number) => void;
  users: User[];
  isUsersLoading: boolean;
  onScheduleFollowUp: (date: string) => void;
}) {
  return <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Información
      </h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Hash size={18} className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">ID</p>
            <p className="text-sm font-medium text-gray-900">
              {novedad.id || 'NOV-2025-00123'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Clock size={18} className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Fecha/Hora</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(novedad.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <MapPin size={18} className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Oficina/Región</p>
            <p className="text-sm font-medium text-gray-900">
              {novedad.office}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <User size={18} className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Reportado por</p>
            <p className="text-sm font-medium text-gray-900">
              {novedad.user_reported}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <User size={18} className="text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Responsable</p>
            <p className="text-sm font-medium text-gray-900">
              {novedad.user_assigned || 'Sin Asignar'}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
        <Paperclip size={16} />
        <span>Adjuntos</span>
      </h3>
      <div className="space-y-2">
        {novedad?.files.map((file, index) =>
          <button
            key={index}
            onClick={() => downloadFile("incidents", novedad.id, file.filename)}
            className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors min-w-0"
          >
            <FileText size={16} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 font-medium truncate hover:underline">
                {file.filename.length > 20
                  ? file.filename.slice(0, 20) + "..."
                  : file.filename}
              </p>
              <p className="text-xs text-gray-500">{file.size_bytes}</p>
            </div>
          </button>
        )}
      </div>
    </div>
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Acciones Rápidas
      </h3>
      <div className="space-y-2">
        {isUsersLoading ? (
          <p className="text-xs text-gray-500">Cargando usuarios...</p>
        ) : (
          <AssignUserPopover
            onSelectUser={onAssignUser}
            currentAssignee={novedad.user_assigned}
          />
        )}
        <ScheduleFollowUpPopover
          onSchedule={onScheduleFollowUp}
          incident={novedad}
        />
      </div>
    </div>
  </div>;
}
function ComentarioComposer({
  onSubmit,
  files,
  setFiles,
  onChangeStatus,
  initialStatus,
  idIncident, // <-- AGREGA EL INCIDENTE AQUI
}: {
  onSubmit: (payload: AddFollowUpDto) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onChangeStatus: (status: string) => void;
  initialStatus: string;
  idIncident: number; // <-- necesario
}) {
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { data: incidentStatusList } = useIncidentStatusList();

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    if (!comment.trim() && files.length === 0) return;

    // 1. Convertir todos los archivos a Base64
    const filesPayload = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        file: await convertFileToBase64(file),
      }))
    );

    // 2. Payload con estructura exacta
    const payload: AddFollowUpDto = {
      id_incident: idIncident,
      id_user: user?.id ?? 0,
      message: comment.trim(),
      attachments: filesPayload,
      status_id: Number(selectedStatus),
    };

    // 3. Enviar a API (tu callback)
    console.log(`ComentarioComposer: `, payload);
    onSubmit(payload);

    // 4. Reset UI
    setComment("");
    setFiles([]);
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prev) => [...prev, ...Array.from(event.target.files)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 font-semibold text-sm">
            {getInitials(user?.name)}
          </span>
        </div>

        <div className="flex-1 space-y-3">
          {/* TEXAREA */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe una actualización..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent
              resize-none text-sm"
          />

          {/* Files Preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm"
                >
                  <span className="text-gray-700 truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleAttachClick}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Paperclip size={16} />
                <span>Adjuntar</span>
              </button>

              {/* SELECT STATUS */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  onChangeStatus(e.target.value);
                }}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5
                  focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              >
                {incidentStatusList?.data.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 bg-[#cf2e2e] text-white px-6 py-2 rounded-lg hover:bg-[#b52626] transition-colors"
            >
              <Send size={16} />
              <span className="text-sm font-medium">Agregar comentario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export function DetalleNovedadModal({
  id,
  onClose
}: DetalleNovedadModalProps) {
  console.log(`Novedad ${id}`)
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  const { isLoading: isLoadingIncident, isError: isErrorIncident, data: incidentData, addFollowUp, updateAssignee, scheduleFollowUp } = useIncident(id);
  const { data: timelineData, isLoading: isLoadingTimeline } = useIncidentFollowUps(id);
  const { data: usersData, isLoading: isLoadingUsers } = useUsersList()
  const { user } = useAuthStore();

  const handleAddComment = (payload: AddFollowUpDto) => {
    addFollowUp(payload);
  };

  const handleAssignUser = (userId: number) => {
    updateAssignee({ incidentId: id, userId: userId });
  };

  const handleScheduleFollowUp = (date: string) => {
    scheduleFollowUp({ incidentId: id, date: date });
  };

  const handleChangeStatus = (status: string) => {
    console.log('Status changed to:', status);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);


  // const { isLoading, isError, data } = useIncident(id);
  if (isErrorIncident) {
    onClose();
  }

  if (isLoadingIncident) {
    return <CustomFullScreenLoading />
  }


  console.log({ isLoadingIncident, incidentData })
  const novedad = incidentData?.data;

  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#cf2e2e] rounded-lg flex items-center justify-center">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Detalle de Novedad : {novedad?.title}
            </h2>
            <p className="text-sm text-gray-600">{novedad?.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getCriticalityColor(novedad?.criticity_slug)}`}>
            {novedad?.criticity}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(novedad?.status_slug)}`}>
            {novedad?.status}
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left column - Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Descripción</h3>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 text-sm mb-4">
            {novedad?.description}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-6">Hilo de Seguimiento</h3>
          <div className="space-y-4">
            {isLoadingTimeline ? (
              <div className="text-center text-gray-500">
                Cargando historial...
              </div>
            ) : timelineData?.data?.length === 0 ? (
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 text-sm mb-4">
                  Sin seguimiento
                </div>
              </div>
            ) : (
              timelineData?.data.map((item) => (
                <TimelineItem
                  key={item.id}
                  messageData={item}
                  usersMap={usersData}
                  type="comment"
                  idIncident={novedad?.id}
                  onAddReply={handleAddComment}
                />
              ))
            )}
          </div>
        </div>
        {/* Right column - Metadata */}
        <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <MetaInfoCard
            novedad={novedad}
            onAssignUser={handleAssignUser}
            users={usersData || []}
            isUsersLoading={isLoadingUsers}
            onScheduleFollowUp={handleScheduleFollowUp}
          />
        </div>
      </div>
      {/* Footer - Comment Composer */}
      <ComentarioComposer
        onSubmit={handleAddComment}
        files={filesToUpload}
        setFiles={setFilesToUpload}
        onChangeStatus={handleChangeStatus}
        initialStatus={novedad?.status_id}
        idIncident={novedad?.id}
      />
    </div>
  </div>;
}