import React, { useEffect, useState } from 'react';
import { X, Clock, User, Building, Hash, Paperclip, Send, UserPlus, Calendar, MapPin, FileText } from 'lucide-react';
interface DetalleNovedadModalProps {
  novedad: any;
  onClose: () => void;
}
interface TimelineItemProps {
  type: 'comment' | 'status' | 'system';
  user: {
    nombre: string;
    rol: string;
    avatar: string;
  };
  timestamp: string;
  content: string;
  attachments?: Array<{
    nombre: string;
    peso: string;
  }>;
  replies?: TimelineItemProps[];
}
function TimelineItem({
  type,
  user,
  timestamp,
  content,
  attachments = [],
  replies = []
}: TimelineItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const getTypeStyles = () => {
    if (type === 'status' || type === 'system') {
      return 'bg-blue-50 border-blue-200';
    }
    return 'bg-white border-gray-200';
  };
  const getTypeIcon = () => {
    if (type === 'status' || type === 'system') {
      return <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {user.avatar}
          </span>
        </div>;
    }
    return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#cf2e2e] to-[#b52626] flex items-center justify-center">
        <span className="text-white font-semibold text-sm">{user.avatar}</span>
      </div>;
  };
  return <div className="space-y-3">
      <div className={`rounded-2xl border p-4 ${getTypeStyles()}`}>
        <div className="flex items-start space-x-3">
          {getTypeIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {user.nombre}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {user.rol}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{timestamp}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
            {attachments.length > 0 && <div className="mt-3 space-y-2">
                {attachments.map((file, idx) => <div key={idx} className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <Paperclip size={14} className="text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {file.nombre}
                    </span>
                    <span className="text-gray-400 text-xs">({file.peso})</span>
                  </div>)}
              </div>}
            {type === 'comment' && <button onClick={() => setShowReplyForm(!showReplyForm)} className="mt-2 text-xs text-[#cf2e2e] hover:text-[#b52626] font-medium">
                ← Responder
              </button>}
          </div>
        </div>
      </div>
      {replies.length > 0 && <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-4">
          {replies.map((reply, idx) => <TimelineItem key={idx} {...reply} />)}
        </div>}
      {showReplyForm && <div className="ml-12 border-l-2 border-gray-200 pl-4">
          <div className="bg-white rounded-xl border border-gray-200 p-3">
            <textarea placeholder="Escribe una respuesta..." rows={2} className="w-full text-sm border-0 focus:ring-0 resize-none" />
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => setShowReplyForm(false)} className="text-xs text-gray-600 hover:text-gray-800 px-3 py-1">
                Cancelar
              </button>
              <button className="text-xs bg-[#cf2e2e] text-white px-3 py-1 rounded-lg hover:bg-[#b52626]">
                Responder
              </button>
            </div>
          </div>
        </div>}
    </div>;
}
function MetaInfoCard({
  novedad
}: {
  novedad: any;
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
                {novedad.fecha}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin size={18} className="text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Oficina/Región</p>
              <p className="text-sm font-medium text-gray-900">
                {novedad.oficina}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <User size={18} className="text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Reportado por</p>
              <p className="text-sm font-medium text-gray-900">
                {novedad.usuario}
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
          <div className="flex items-center space-x-2 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
            <FileText size={16} className="text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 font-medium truncate">
                reporte_incidente.pdf
              </p>
              <p className="text-xs text-gray-500">340KB</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Acciones Rápidas
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <UserPlus size={16} />
            <span>Asignar responsable</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <Calendar size={16} />
            <span>Programar seguimiento</span>
          </button>
        </div>
      </div>
    </div>;
}
function ComentarioComposer({
  onSubmit,
  onAttach,
  onChangeStatus
}: {
  onSubmit: (comment: string, status: string) => void;
  onAttach: () => void;
  onChangeStatus: (status: string) => void;
}) {
  const [comment, setComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('En Seguimiento');
  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment, selectedStatus);
      setComment('');
    }
  };
  return <div className="bg-white border-t border-gray-200 p-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 font-semibold text-sm">UA</span>
        </div>
        <div className="flex-1 space-y-3">
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Escribe una actualización o @menciona a alguien..." rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none text-sm" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onAttach} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Paperclip size={16} />
                <span>Adjuntar</span>
              </button>
              <select value={selectedStatus} onChange={e => {
              setSelectedStatus(e.target.value);
              onChangeStatus(e.target.value);
            }} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                <option>Pendiente</option>
                <option>En Seguimiento</option>
                <option>Resuelta</option>
              </select>
            </div>
            <button onClick={handleSubmit} className="flex items-center space-x-2 bg-[#cf2e2e] text-white px-6 py-2 rounded-lg hover:bg-[#b52626] transition-colors">
              <Send size={16} />
              <span className="text-sm font-medium">Agregar comentario</span>
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export function DetalleNovedadModal({
  novedad,
  onClose
}: DetalleNovedadModalProps) {
  const [timeline, setTimeline] = useState<TimelineItemProps[]>([{
    type: 'status',
    timestamp: '20/10/2025 07:15',
    content: 'Estado actualizado a En seguimiento',
    user: {
      nombre: 'Sistema',
      rol: 'Automático',
      avatar: 'S'
    }
  }, {
    type: 'comment',
    timestamp: '20/10/2025 08:10',
    user: {
      nombre: 'María García',
      rol: 'RRHH',
      avatar: 'MG'
    },
    content: 'Se realizó contacto con IGSS para confirmar suspensión.',
    attachments: [],
    replies: [{
      type: 'comment',
      timestamp: '20/10/2025 08:25',
      user: {
        nombre: 'Pedro Ramírez',
        rol: 'Operaciones',
        avatar: 'PR'
      },
      content: 'Confirmo recepción. Agrego evidencia en el expediente.',
      attachments: [{
        nombre: 'foto_evidencia.jpg',
        peso: '1.2MB'
      }]
    }]
  }, {
    type: 'comment',
    timestamp: '20/10/2025 09:05',
    user: {
      nombre: 'Ana Martínez',
      rol: 'Coordinación',
      avatar: 'AM'
    },
    content: 'Cliente informado; seguimiento programado para la tarde.',
    attachments: []
  }]);
  const getCriticalityColor = (criticidad: string) => {
    const colors = {
      Alta: 'bg-red-100 text-red-700 border-red-300',
      Media: 'bg-orange-100 text-orange-700 border-orange-300',
      Baja: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[criticidad as keyof typeof colors] || '';
  };
  const getEstadoColor = (estado: string) => {
    const colors = {
      'En Seguimiento': 'bg-blue-100 text-blue-700',
      Resuelta: 'bg-green-100 text-green-700',
      Pendiente: 'bg-gray-100 text-gray-700'
    };
    return colors[estado as keyof typeof colors] || '';
  };
  const handleAddComment = (comment: string, status: string) => {
    const newComment: TimelineItemProps = {
      type: 'comment',
      timestamp: new Date().toLocaleString('es-ES'),
      user: {
        nombre: 'Usuario Actual',
        rol: 'Usuario',
        avatar: 'UA'
      },
      content: comment,
      attachments: []
    };
    if (status !== novedad.estado) {
      const statusUpdate: TimelineItemProps = {
        type: 'status',
        timestamp: new Date().toLocaleString('es-ES'),
        user: {
          nombre: 'Sistema',
          rol: 'Automático',
          avatar: 'S'
        },
        content: `Estado actualizado a ${status}`
      };
      setTimeline([...timeline, statusUpdate, newComment]);
    } else {
      setTimeline([...timeline, newComment]);
    }
  };
  const handleAttach = () => {
    // Mock file attachment
    console.log('Attach file clicked');
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
                Detalle de Novedad
              </h2>
              <p className="text-sm text-gray-600">{novedad.tipo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getCriticalityColor(novedad.criticidad)}`}>
              {novedad.criticidad}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getEstadoColor(novedad.estado)}`}>
              {novedad.estado}
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
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Hilo de Seguimiento
            </h3>
            <div className="space-y-4">
              {timeline.map((item, idx) => <TimelineItem key={idx} {...item} />)}
            </div>
          </div>
          {/* Right column - Metadata */}
          <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <MetaInfoCard novedad={novedad} />
          </div>
        </div>
        {/* Footer - Comment Composer */}
        <ComentarioComposer onSubmit={handleAddComment} onAttach={handleAttach} onChangeStatus={handleChangeStatus} />
      </div>
    </div>;
}