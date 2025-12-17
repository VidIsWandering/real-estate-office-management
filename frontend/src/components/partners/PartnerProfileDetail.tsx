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
import { useState } from "react";
import { Partner } from "@/pages/Partners";
import { Badge } from "@/components/ui/badge";

interface PartnerProfileDetailProps {
  partner: Partner;
  onEdit: () => void;
  onDelete: () => void;
}

interface ContactHistory {
  id: string;
  date: string;
  type: string;
  notes: string;
  staff: string;
}

const mockContactHistory: Record<string, ContactHistory[]> = {
  P001: [
    {
      id: "C001",
      date: "2024-01-08",
      type: "Phone Call",
      notes: "Discussed property viewing schedule",
      staff: "Alice Chen",
    },
    {
      id: "C002",
      date: "2024-01-05",
      type: "Email",
      notes: "Sent property listings",
      staff: "Alice Chen",
    },
    {
      id: "C003",
      date: "2024-01-02",
      type: "Meeting",
      notes: "In-person consultation",
      staff: "Alice Chen",
    },
  ],
  P002: [
    {
      id: "C004",
      date: "2024-01-07",
      type: "Email",
      notes: "Follow-up on rental properties",
      staff: "Bob Smith",
    },
    {
      id: "C005",
      date: "2024-01-03",
      type: "Phone Call",
      notes: "Contract negotiation",
      staff: "Bob Smith",
    },
  ],
  P003: [
    {
      id: "C006",
      date: "2024-01-06",
      type: "Meeting",
      notes: "Property appraisal discussion",
      staff: "Carol Davis",
    },
    {
      id: "C007",
      date: "2023-12-28",
      type: "Email",
      notes: "Sent investment portfolio",
      staff: "Carol Davis",
    },
  ],
};

export function PartnerProfileDetail({
  partner,
  onEdit,
  onDelete,
}: PartnerProfileDetailProps) {
  const [expandContactHistory, setExpandContactHistory] = useState(false);

  const contactHistory = mockContactHistory[partner.id] || [];

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

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case "Phone Call":
        return "bg-blue-50 border-blue-200";
      case "Email":
        return "bg-amber-50 border-amber-200";
      case "Meeting":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {partner.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{partner.name}</h3>
            <p className="text-blue-100">{partner.code}</p>
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
                Partner Type
              </p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <Badge className={`${getTypeColor(partner.partnerType)}`}>
                  {getTypeLabel(partner.partnerType)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${getStatusColor(partner.status)}`}>
                  {partner.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Assigned Staff
              </p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {partner.assignedStaff}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Join Date
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {new Date(partner.joinDate).toLocaleDateString()}
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
                  {partner.email}
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
                  {partner.phone}
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
                  {partner.address}
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
              {contactHistory.length > 0 ? (
                contactHistory.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 border rounded-lg ${getContactTypeColor(
                      contact.type,
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-gray-900">
                        {contact.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(contact.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-1">
                      {contact.notes}
                    </p>
                    <p className="text-xs text-gray-500">by {contact.staff}</p>
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
                  `Are you sure you want to delete ${partner.name}?`,
                )
              ) {
                onDelete();
              }
            }}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Partner
          </button>
        </div>
      </div>
    </div>
  );
}
