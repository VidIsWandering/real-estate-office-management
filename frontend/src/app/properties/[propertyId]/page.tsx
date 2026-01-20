"use client";

import {
  ArrowLeft,
  Home,
  MapPin,
  User,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Maximize,
  Layers,
  Bed,
  Bath,
  Sofa,
  Compass,
  StickyNote,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { OwnerInfoModal } from "@/components/properties/OwnerInfoModal";
import { getProfile } from "@/lib/api";
import {
  getRealEstateById,
  legalCheckRealEstate,
  type RealEstate,
  type RealEstateStatus,
} from "@/lib/api/real-estates";

interface Property {
  id: string;
  image: string;
  name: string;
  type: "Apartment" | "House" | "Land" | "Commercial";
  status:
    | "New"
    | "Pending legal review"
    | "Listed"
    | "Negotiating"
    | "Closed"
    | "Paused";
  price: number;
  agent: string;
  lastUpdated: string;
  // Plot information
  plotWidth: number; // meters
  plotLength: number; // meters
  plotArea: number; // m²
  // Building information
  buildingWidth: number; // meters
  buildingLength: number; // meters
  buildingArea: number; // m²
  // Details
  direction: string;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  notes: string;
  // Owner information
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
}

function getPropertyEmoji(type: Property["type"]) {
  switch (type) {
    case "Apartment":
      return "🏢";
    case "House":
      return "🏠";
    case "Land":
      return "🌳";
    case "Commercial":
      return "🏢";
  }
}

function toUiPropertyType(type: string): Property["type"] {
  const normalized = type.trim().toLowerCase();
  if (normalized.includes("apartment") || normalized.includes("condo")) {
    return "Apartment";
  }
  if (normalized.includes("house") || normalized.includes("townhouse")) {
    return "House";
  }
  if (normalized.includes("land")) {
    return "Land";
  }
  return "Commercial";
}

function toUiPropertyStatus(status: RealEstateStatus): Property["status"] {
  switch (status) {
    case "created":
      return "New";
    case "pending_legal_check":
      return "Pending legal review";
    case "listed":
      return "Listed";
    case "negotiating":
      return "Negotiating";
    case "transacted":
      return "Closed";
    case "suspended":
      return "Paused";
  }
}

function toUiNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function toTitleCaseWord(value: string): string {
  const v = value.trim();
  if (!v) return v;
  return v[0].toUpperCase() + v.slice(1).toLowerCase();
}

function getStatusColor(status: Property["status"]) {
  const colors = {
    New: "bg-gray-100 text-gray-800",
    "Pending legal review": "bg-blue-100 text-blue-800",
    Listed: "bg-blue-100 text-blue-800",
    Negotiating: "bg-purple-100 text-purple-800",
    Closed: "bg-green-100 text-green-800",
    Paused: "bg-gray-100 text-gray-800",
  };
  return colors[status];
}

export default function PropertyDetailPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const router = useRouter();
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [realEstate, setRealEstate] = useState<RealEstate | null>(null);
  const [userPosition, setUserPosition] = useState<string | null>(null);
  const [owner, setOwner] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null>(null);
  const [staffName, setStaffName] = useState<string | null>(null);
  const [legalNote, setLegalNote] = useState("");
  const [isLegalSubmitting, setIsLegalSubmitting] = useState(false);
  const [legalError, setLegalError] = useState<string | null>(null);
  const [legalSuccess, setLegalSuccess] = useState<string | null>(null);

  const canLegalCheck =
    userPosition === "legal_officer" || userPosition === "manager";

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        // Load current user position to decide whether to show legal-check UI.
        try {
          const profile = await getProfile();
          if (!cancelled) {
            setUserPosition(String(profile.data.position ?? "").toLowerCase());
          }
        } catch {
          // Ignore profile load errors; page can still render.
          if (!cancelled) setUserPosition(null);
        }

        const res = await getRealEstateById(params.propertyId);
        const payload = res.data;
        if (!payload || !payload.realEstate) {
          if (!cancelled) {
            setRealEstate(null);
            setOwner(null);
            setStaffName(null);
          }
          return;
        }

        if (cancelled) return;

        setRealEstate(payload.realEstate);

        // Reset legal-check feedback when loading a new record.
        setLegalError(null);
        setLegalSuccess(null);

        const rawOwner = payload.owner as
          | {
              id?: string | number;
              full_name?: string;
              email?: string | null;
              phone_number?: string | null;
              address?: string | null;
            }
          | undefined;

        if (rawOwner?.full_name) {
          setOwner({
            id: String(rawOwner.id ?? ""),
            name: rawOwner.full_name,
            email: rawOwner.email ?? "",
            phone: rawOwner.phone_number ?? "",
            address: rawOwner.address ?? "",
          });
        } else {
          setOwner(null);
        }

        const rawStaff = payload.staff as
          | {
              full_name?: string;
              email?: string | null;
            }
          | undefined;

        if (rawStaff?.full_name) {
          setStaffName(
            rawStaff.email
              ? `${rawStaff.full_name} (${rawStaff.email})`
              : rawStaff.full_name,
          );
        } else {
          setStaffName(null);
        }
      } catch (e) {
        if (cancelled) return;
        setLoadError(
          e instanceof Error ? e.message : "Failed to load property",
        );
        setRealEstate(null);
        setOwner(null);
        setStaffName(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [params.propertyId]);

  const handleLegalDecision = async (isApproved: boolean) => {
    if (!realEstate) return;

    setIsLegalSubmitting(true);
    setLegalError(null);
    setLegalSuccess(null);

    try {
      await legalCheckRealEstate(realEstate.id, {
        is_approved: isApproved,
        note: legalNote.trim() ? legalNote.trim() : undefined,
      });

      const refreshed = await getRealEstateById(realEstate.id);
      if (refreshed.data?.realEstate) {
        setRealEstate(refreshed.data.realEstate);
      }

      setLegalSuccess(
        isApproved
          ? "Approved. Status moved to LISTED."
          : "Rejected. Status kept as PENDING with note.",
      );
    } catch (e) {
      setLegalError(
        e instanceof Error ? e.message : "Failed to submit legal check",
      );
    } finally {
      setIsLegalSubmitting(false);
    }
  };

  const property: Property | null = useMemo(() => {
    if (!realEstate) return null;
    const type = toUiPropertyType(realEstate.type);
    const status = toUiPropertyStatus(realEstate.status);

    return {
      id: String(realEstate.id),
      image: getPropertyEmoji(type),
      name: realEstate.title,
      type,
      status,
      price: toUiNumber(realEstate.price),
      agent: staffName ?? String(realEstate.staff_id),
      lastUpdated: new Date().toISOString().split("T")[0] ?? "",
      plotWidth: 0,
      plotLength: 0,
      plotArea: toUiNumber(realEstate.area),
      buildingWidth: 0,
      buildingLength: 0,
      buildingArea: toUiNumber(realEstate.area),
      direction: realEstate.direction
        ? toTitleCaseWord(String(realEstate.direction))
        : "",
      floors: 0,
      bedrooms: 0,
      bathrooms: 0,
      livingRooms: 0,
      notes: realEstate.description ? String(realEstate.description) : "",
      ownerId: owner?.id ?? "",
      ownerName: owner?.name ?? "Unknown",
      ownerEmail: owner?.email ?? "—",
      ownerPhone: owner?.phone ?? "—",
      ownerAddress: owner?.address ?? "—",
    };
  }, [owner, realEstate, staffName]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Failed to load property
        </h1>
        <p className="text-gray-600 mb-6">{loadError}</p>
        <button
          onClick={() => router.push("/properties")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Property Not Found
        </h1>
        {/* <p className="text-gray-600 mb-6">
          The property you're looking for doesn't exist.
        </p> */}
        <button
          onClick={() => router.push("/properties")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/properties")}
        className="mb-4 md:mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm md:text-base"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </button>

      {/* Property Detail Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-4 md:px-6 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                {property.image}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {property.name}
                </h1>
                <p className="text-blue-100 mt-1 text-sm">{property.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(property.status)}>
                {property.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Basic information
              </h2>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-lg font-bold text-primary">
                    ${property.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Agent:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.agent}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Plot information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Maximize className="w-5 h-5" />
                Plot information
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Width:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.plotWidth} m
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Length:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.plotLength} m
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Area:</p>
                  <p className="text-lg font-bold text-blue-900">
                    {property.plotArea} m²
                  </p>
                </div>
              </div>
            </div>

            {/* Building information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Building information
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Width:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.buildingWidth} m
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Length:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.buildingLength} m
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Area:</p>
                  <p className="text-lg font-bold text-green-900">
                    {property.buildingArea} m²
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Direction:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.direction}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Floors:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.floors}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bedrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Bathrooms:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bathrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sofa className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Living rooms:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.livingRooms}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                Notes
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">{property.notes}</p>
              </div>
            </div>

            {/* Legal check */}
            {canLegalCheck && realEstate?.status === "pending_legal_check" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Legal check
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                  <label className="text-sm text-gray-700 font-medium">
                    Note (optional)
                  </label>
                  <textarea
                    value={legalNote}
                    onChange={(e) => setLegalNote(e.target.value)}
                    placeholder="Reason / comments..."
                    className="w-full min-h-[90px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  {legalError && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      {legalError}
                    </div>
                  )}

                  {legalSuccess && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                      {legalSuccess}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      disabled={isLegalSubmitting}
                      onClick={() => void handleLegalDecision(true)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLegalSubmitting ? "Submitting..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={isLegalSubmitting}
                      onClick={() => void handleLegalDecision(false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLegalSubmitting ? "Submitting..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Owner information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Owner information
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <button
                  onClick={() => setIsOwnerModalOpen(true)}
                  className="w-full text-left hover:bg-white/50 p-3 rounded-lg transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900 underline hover:text-blue-700">
                        {property.ownerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {property.ownerEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {property.ownerPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {property.ownerAddress}
                      </span>
                    </div>
                  </div>
                </button>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Click to view owner details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Owner Info Modal */}
      <OwnerInfoModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        owner={{
          id: property.ownerId,
          name: property.ownerName,
          email: property.ownerEmail,
          phone: property.ownerPhone,
          address: property.ownerAddress,
        }}
      />
    </div>
  );
}
