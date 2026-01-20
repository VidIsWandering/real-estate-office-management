"use client";

import { PropertyTable } from "@/components/properties/PropertiesTable";
import type { Property } from "@/components/properties/PropertiesTable";
import { PropertySummary } from "@/components/properties/PropertiesSummary";
import {
  AddPropertyForm,
  type PropertyFormData,
} from "@/components/properties/AddPropertyForm";
import {
  createRealEstate,
  getClientOptions,
  getRealEstateById,
  getRealEstatesList,
  getStaffList,
  updateRealEstateById,
  updateRealEstateStatus,
  type RealEstate,
  type RealEstateStatus,
} from "@/lib/api";
import { Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
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

function toUiPropertyStatus(status: RealEstate["status"]): Property["status"] {
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

function toApiTransactionType(value: PropertyFormData["transactionType"]):
  | "sale"
  | "rent" {
  return value === "Rent" ? "rent" : "sale";
}

function toApiStatus(value: Property["status"]): RealEstateStatus {
  switch (value) {
    case "New":
      return "created";
    case "Pending legal review":
      return "pending_legal_check";
    case "Listed":
      return "listed";
    case "Negotiating":
      return "negotiating";
    case "Closed":
      return "transacted";
    case "Paused":
      return "suspended";
  }
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<
    Array<{ id: number; full_name: string; phone_number?: string | null }>
  >([]);
  const [isOwnersLoading, setIsOwnersLoading] = useState(false);
  const [ownersLoadError, setOwnersLoadError] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<string[]>([]);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [staffLoadError, setStaffLoadError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [isEditPropertyDialogOpen, setIsEditPropertyDialogOpen] =
    useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [editingRealEstate, setEditingRealEstate] = useState<RealEstate | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const reloadOwners = async () => {
    setIsOwnersLoading(true);
    setOwnersLoadError(null);
    try {
      const clientsRes = await getClientOptions({ page: 1, limit: 100 });
      if (clientsRes.success !== true) {
        setOwners([]);
        setOwnersLoadError("Failed to load owners");
        return;
      }

      setOwners(
        clientsRes.data
          .filter((c) => typeof c.id === "number")
          .map((c) => ({
            id: c.id,
            full_name: c.full_name,
            phone_number: c.phone_number,
          })),
      );
    } catch (e) {
      setOwners([]);
      setOwnersLoadError(
        e instanceof Error ? e.message : "Failed to load owners",
      );
    } finally {
      setIsOwnersLoading(false);
    }
  };

  const reloadStaffMembers = async () => {
    setIsStaffLoading(true);
    setStaffLoadError(null);
    try {
      // Backend validator caps limit at 100
      const staffRes = await getStaffList({ page: 1, limit: 100 });
      if (staffRes.success !== true) {
        setStaffMembers([]);
        setStaffLoadError("Failed to load staff");
        return;
      }

      setStaffMembers(
        staffRes.data
          .map((s) => (typeof s.full_name === "string" ? s.full_name : null))
          .filter((name): name is string => Boolean(name)),
      );
    } catch (e) {
      setStaffMembers([]);
      setStaffLoadError(
        e instanceof Error ? e.message : "Failed to load staff",
      );
    } finally {
      setIsStaffLoading(false);
    }
  };

  const reloadProperties = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [realEstatesRes, staffRes] = await Promise.all([
        getRealEstatesList({ page: 1, limit: 100 }),
        getStaffList({ page: 1, limit: 100 }),
      ]);

      const staffNameById = new Map(
        staffRes.data
          .filter((s) => typeof s.id === "number")
          .map((s) => [String(s.id), s.full_name] as const),
      );

      const mapped: Property[] = realEstatesRes.data.map((re) => {
        const type = toUiPropertyType(re.type);
        const status = toUiPropertyStatus(re.status);
        const staffName = staffNameById.get(String(re.staff_id));

        return {
          id: String(re.id),
          image: getPropertyEmoji(type),
          name: re.title,
          type,
          status,
          price: toUiNumber(re.price),
          agent: staffName ?? `Staff #${re.staff_id}`,
          address: re.location,
          bedrooms: 0,
          bathrooms: 0,
          area: toUiNumber(re.area),
          lastUpdated: todayIsoDate(),
        };
      });

      if (realEstatesRes.success !== true) {
        setLoadError("Failed to load properties");
      }

      setProperties(mapped);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void reloadProperties();
    void reloadOwners();
    void reloadStaffMembers();
  }, []);

  const editingProperty = properties.find((p) => p.id === editingPropertyId);

  const handleAddProperty = async (data: PropertyFormData) => {
    setLoadError(null);
    try {
      const transaction_type =
        data.transactionType === "Sale"
          ? "sale"
          : data.transactionType === "Rent"
            ? "rent"
            : "sale";

      const ownerId = Number(data.ownerId);
      if (!Number.isFinite(ownerId)) {
        throw new Error("Please select a valid owner");
      }

      if (!data.direction) {
        throw new Error("Please select a direction");
      }

      await createRealEstate({
        title: data.name,
        type: data.type,
        transaction_type,
        location: data.address,
        price: Number(data.price),
        area: Number(data.area),
        direction: data.direction,
        owner_id: ownerId,
        description: data.description || undefined,
        media_files: data.mediaFiles,
        legal_docs: data.legalDocFiles,
      });

      setIsAddPropertyDialogOpen(false);
      await reloadProperties();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to create property");
    }
  };

  const handleStartEditProperty = (property: Property) => {
    void (async () => {
      setLoadError(null);
      setEditingPropertyId(property.id);
      setEditingRealEstate(null);

      try {
        const res = await getRealEstateById(property.id);
        if (!res.data?.realEstate) {
          throw new Error("Failed to load property details");
        }
        setEditingRealEstate(res.data.realEstate);
        setIsEditPropertyDialogOpen(true);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Failed to load property details",
        );
        setEditingPropertyId(null);
        setEditingRealEstate(null);
        setIsEditPropertyDialogOpen(false);
      } finally {
      }
    })();
  };

  const handleEditProperty = async (data: PropertyFormData) => {
    if (!editingPropertyId || !editingRealEstate) return;

    setLoadError(null);
    try {
      const ownerId = Number(data.ownerId);
      if (!Number.isFinite(ownerId)) {
        throw new Error("Please select a valid owner");
      }

      if (!data.direction) {
        throw new Error("Please select a direction");
      }

      const desiredStatus = data.status as Property["status"];
      const currentStatusUi = editingProperty?.status;

      await updateRealEstateById(editingPropertyId, {
        title: data.name,
        type: data.type,
        transaction_type: toApiTransactionType(data.transactionType),
        location: data.address,
        price: Number(data.price),
        area: Number(data.area),
        direction: data.direction,
        owner_id: ownerId,
        description: data.description || undefined,
        media_files: data.mediaFiles.length > 0 ? data.mediaFiles : undefined,
        legal_docs: data.legalDocFiles.length > 0 ? data.legalDocFiles : undefined,
      });

      if (currentStatusUi && desiredStatus !== currentStatusUi) {
        await updateRealEstateStatus(
          editingPropertyId,
          toApiStatus(desiredStatus),
        );
      }

      setIsEditPropertyDialogOpen(false);
      setEditingPropertyId(null);
      setEditingRealEstate(null);
      await reloadProperties();
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to update property");
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    if (editingPropertyId === propertyId) {
      setIsEditPropertyDialogOpen(false);
      setEditingPropertyId(null);
      setEditingRealEstate(null);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Properties Management
        </h1>
        <p className="text-gray-600 mt-1">
          View, filter, and manage all your property listings.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties or agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Pending legal review">Pending legal review</option>
            <option value="Listed">Listed</option>
            <option value="Negotiating">Negotiating</option>
            <option value="Closed">Closed</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        {/* Add Property Button */}
        <button
          type="button"
          onClick={() => {
            void reloadOwners();
            void reloadStaffMembers();
            setIsAddPropertyDialogOpen(true);
          }}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table - Left side */}
        <div className="lg:col-span-2">
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-600">
              Loading properties...
            </div>
          ) : (
            <PropertyTable
              properties={properties}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              filterType={filterType}
              onEditProperty={handleStartEditProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          )}
        </div>

        {/* Summary - Right side */}
        <div>
          <PropertySummary />
        </div>
      </div>

      <AddPropertyForm
        isOpen={isAddPropertyDialogOpen}
        onClose={() => setIsAddPropertyDialogOpen(false)}
        onSubmit={handleAddProperty}
        owners={owners}
        ownersLoading={isOwnersLoading}
        ownersError={ownersLoadError}
        staffMembers={staffMembers}
        staffLoading={isStaffLoading}
        staffError={staffLoadError}
      />

      {editingProperty && (
        <AddPropertyForm
          isOpen={isEditPropertyDialogOpen}
          onClose={() => {
            setIsEditPropertyDialogOpen(false);
            setEditingPropertyId(null);
            setEditingRealEstate(null);
          }}
          onSubmit={handleEditProperty}
          owners={owners}
          ownersLoading={isOwnersLoading}
          ownersError={ownersLoadError}
          staffMembers={staffMembers}
          staffLoading={isStaffLoading}
          staffError={staffLoadError}
          title="Edit property"
          submitLabel="Save changes"
          initialData={{
            name: editingRealEstate?.title ?? editingProperty.name,
            type: editingRealEstate?.type ?? editingProperty.type,
            transactionType:
              editingRealEstate?.transaction_type === "rent" ? "Rent" : "Sale",
            status: editingProperty.status,
            price: String(editingRealEstate?.price ?? editingProperty.price),
            agent: editingProperty.agent,
            address: editingRealEstate?.location ?? editingProperty.address,
            bedrooms: String(editingProperty.bedrooms),
            bathrooms: String(editingProperty.bathrooms),
            area: String(editingRealEstate?.area ?? editingProperty.area),
            direction: (editingRealEstate?.direction ?? "") as PropertyFormData["direction"],
            ownerId: String(editingRealEstate?.owner_id ?? ""),
            description: String(editingRealEstate?.description ?? ""),
          }}
        />
      )}
    </>

  );
}
