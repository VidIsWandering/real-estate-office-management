import {
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Edit2,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getClientNotes, type ClientNote } from "@/lib/api";
import type { ClientItem } from "./types";

interface ClientProfileDetailProps {
  client: ClientItem;
  onEdit: () => void;
  onDelete: () => void;
}

const toContactTypeColor = (type: string) => {
  switch (type) {
    case "Note":
      return "bg-gray-50 border-gray-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export function ClientProfileDetail({
  client,
  onEdit,
  onDelete,
}: ClientProfileDetailProps) {
  const [expandContactHistory, setExpandContactHistory] = useState(false);
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const clientId = useMemo(() => Number(client.id), [client.id]);

  useEffect(() => {
    if (!expandContactHistory) return;
    if (!Number.isFinite(clientId)) return;

    const run = async () => {
      setNotesLoading(true);
      setNotesError(null);
      try {
        const res = await getClientNotes({ clientId, page: 1, limit: 50 });
        setNotes(res.data);
      } catch (e) {
        setNotesError(e instanceof Error ? e.message : "Failed to load notes");
      } finally {
        setNotesLoading(false);
      }
    };

    void run();
  }, [clientId, expandContactHistory]);

  const getTypeLabel = (type: string) => {
    return type === "owner" ? "Owner" : "Customer";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContactTypeColor = toContactTypeColor;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {client.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{client.name}</h3>
            <p className="text-blue-100">{client.code}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Basic Information
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Client Type
              </p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <Badge className={`${getTypeColor(client.clientType)}`}>
                  {getTypeLabel(client.clientType)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(client.status)}`}>
                  {client.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Assigned Staff
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {client.assignedStaff}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Join Date
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {new Date(client.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Contact Information
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {client.email}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Phone
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {client.phone}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Address
              </p>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-900">
                  {client.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact History */}
        <div>
          <button
            onClick={() => setExpandContactHistory(!expandContactHistory)}
            className="w-full flex items-center justify-between mb-4 group"
          >
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact History
            </h4>
            <span className="text-gray-400 group-hover:text-gray-600">
              {expandContactHistory ? "−" : "+"}
            </span>
          </button>

          {expandContactHistory && (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {notesError && (
                <p className="text-sm text-red-600 text-center py-2">
                  {notesError}
                </p>
              )}
              {notesLoading ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Loading contact history...
                </p>
              ) : notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 border rounded-lg ${getContactTypeColor(
                      "Note",
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-gray-900">
                        Note
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-1">{note.content}</p>
                    <p className="text-xs text-gray-500">
                      by {note.created_by_name ?? `Staff #${note.created_by}`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No contact history
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Information
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${client.name}?`,
                )
              ) {
                onDelete();
              }
            }}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Client
          </button>
        </div>
      </div>
    </div>
  );
}
