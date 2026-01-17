"use client";

import { PropertyTable } from "@/components/properties/PropertiesTable";
import type { Property } from "@/components/properties/PropertiesTable";
import { PropertySummary } from "@/components/properties/PropertiesSummary";
import {
  AddPropertyForm,
  type PropertyFormData,
} from "@/components/properties/AddPropertyForm";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

const initialProperties: Property[] = [
  {
    id: "1",
    image: "🏢",
    name: "Downtown Luxury Penthouse",
    type: "Apartment",
    status: "Listed",
    price: 950000,
    agent: "Alice Chen",
    address: "123 Main St, Downtown",
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    image: "🏠",
    name: "Suburban Family Home",
    type: "House",
    status: "New",
    price: 425000,
    agent: "Bob Smith",
    address: "456 Maple Ave, Suburb",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    lastUpdated: "2024-01-18",
  },
  {
    id: "3",
    image: "🏢",
    name: "Commercial Office Space",
    type: "Commercial",
    status: "Pending legal review",
    price: 1200000,
    agent: "Carol Davis",
    address: "789 Business Rd, City Center",
    bedrooms: 0,
    bathrooms: 4,
    area: 6000,
    lastUpdated: "2024-01-20",
  },
  {
    id: "4",
    image: "🏖️",
    name: "Beachfront Condo",
    type: "Apartment",
    status: "Negotiating",
    price: 650000,
    agent: "David Lee",
    address: "321 Ocean Dr, Beach District",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    lastUpdated: "2024-01-17",
  },
  {
    id: "5",
    image: "🌳",
    name: "Residential Land Plot",
    type: "Land",
    status: "Paused",
    price: 280000,
    agent: "Emma Wilson",
    address: "654 Cedar Ln, Outskirts",
    bedrooms: 0,
    bathrooms: 0,
    area: 12000,
    lastUpdated: "2024-01-19",
  },
  {
    id: "6",
    image: "🏠",
    name: "Modern Urban Townhouse",
    type: "House",
    status: "Closed",
    price: 580000,
    agent: "Frank Brown",
    address: "987 Birch Blvd, Urban",
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    lastUpdated: "2024-01-10",
  },
];

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

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isAddPropertyDialogOpen, setIsAddPropertyDialogOpen] = useState(false);
  const [isEditPropertyDialogOpen, setIsEditPropertyDialogOpen] =
    useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const editingProperty = properties.find((p) => p.id === editingPropertyId);

  const handleAddProperty = (data: PropertyFormData) => {
    const type = data.type as Property["type"];
    const status = data.status as Property["status"];

    const newProperty: Property = {
      id: String(Date.now()),
      image: getPropertyEmoji(type),
      name: data.name,
      type,
      status,
      price: Number(data.price),
      agent: data.agent,
      address: data.address,
      bedrooms: data.bedrooms ? Number(data.bedrooms) : 0,
      bathrooms: data.bathrooms ? Number(data.bathrooms) : 0,
      area: data.area ? Number(data.area) : 0,
      lastUpdated: todayIsoDate(),
    };

    setProperties((prev) => [newProperty, ...prev]);
    setIsAddPropertyDialogOpen(false);
  };

  const handleStartEditProperty = (property: Property) => {
    setEditingPropertyId(property.id);
    setIsEditPropertyDialogOpen(true);
  };

  const handleEditProperty = (data: PropertyFormData) => {
    if (!editingProperty) return;

    const type = data.type as Property["type"];
    const status = data.status as Property["status"];

    setProperties((prev) =>
      prev.map((p) =>
        p.id === editingProperty.id
          ? {
              ...p,
              image: getPropertyEmoji(type),
              name: data.name,
              type,
              status,
              price: Number(data.price),
              agent: data.agent,
              address: data.address,
              bedrooms: data.bedrooms ? Number(data.bedrooms) : 0,
              bathrooms: data.bathrooms ? Number(data.bathrooms) : 0,
              area: data.area ? Number(data.area) : 0,
              lastUpdated: todayIsoDate(),
            }
          : p,
      ),
    );

    setIsEditPropertyDialogOpen(false);
    setEditingPropertyId(null);
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    if (editingPropertyId === propertyId) {
      setIsEditPropertyDialogOpen(false);
      setEditingPropertyId(null);
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
          onClick={() => setIsAddPropertyDialogOpen(true)}
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
          <PropertyTable
            properties={properties}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterType={filterType}
            onEditProperty={handleStartEditProperty}
            onDeleteProperty={handleDeleteProperty}
          />
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
      />

      {editingProperty && (
        <AddPropertyForm
          isOpen={isEditPropertyDialogOpen}
          onClose={() => {
            setIsEditPropertyDialogOpen(false);
            setEditingPropertyId(null);
          }}
          onSubmit={handleEditProperty}
          title="Edit property"
          submitLabel="Save changes"
          initialData={{
            name: editingProperty.name,
            type: editingProperty.type,
            status: editingProperty.status,
            price: String(editingProperty.price),
            agent: editingProperty.agent,
            address: editingProperty.address,
            bedrooms: String(editingProperty.bedrooms),
            bathrooms: String(editingProperty.bathrooms),
            area: String(editingProperty.area),
          }}
        />
      )}
    </>
  );
}
