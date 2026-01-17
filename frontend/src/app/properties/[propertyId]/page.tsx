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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { OwnerInfoModal } from "@/components/properties/OwnerInfoModal";

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

// Mock data - In real app, this would come from API/database
const propertiesData: Property[] = [
  {
    id: "1",
    image: "🏢",
    name: "Downtown Luxury Penthouse",
    type: "Apartment",
    status: "Listed",
    price: 950000,
    agent: "Alice Chen",
    lastUpdated: "2024-01-15",
    plotWidth: 20,
    plotLength: 30,
    plotArea: 600,
    buildingWidth: 15,
    buildingLength: 25,
    buildingArea: 375,
    direction: "Southeast",
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    livingRooms: 2,
    notes: "Premium apartment with a great view and luxury interior.",
    ownerId: "C001",
    ownerName: "Nguyen Van A",
    ownerEmail: "nguyenvana@gmail.com",
    ownerPhone: "0901234567",
    ownerAddress: "123 Nguyen Hue St, District 1, Ho Chi Minh City",
  },
  {
    id: "2",
    image: "🏠",
    name: "Suburban Family Home",
    type: "House",
    status: "New",
    price: 425000,
    agent: "Bob Smith",
    lastUpdated: "2024-01-18",
    plotWidth: 10,
    plotLength: 20,
    plotArea: 200,
    buildingWidth: 8,
    buildingLength: 15,
    buildingArea: 120,
    direction: "South",
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    livingRooms: 1,
    notes: "Newly built home in a quiet neighborhood.",
    ownerId: "C002",
    ownerName: "Tran Thi B",
    ownerEmail: "tranthib@gmail.com",
    ownerPhone: "0912345678",
    ownerAddress: "456 Le Loi St, District 3, Ho Chi Minh City",
  },
  {
    id: "3",
    image: "🏢",
    name: "Commercial Office Space",
    type: "Commercial",
    status: "Pending legal review",
    price: 1200000,
    agent: "Carol Davis",
    lastUpdated: "2024-01-20",
    plotWidth: 25,
    plotLength: 40,
    plotArea: 1000,
    buildingWidth: 20,
    buildingLength: 35,
    buildingArea: 700,
    direction: "East",
    floors: 3,
    bedrooms: 0,
    bathrooms: 4,
    livingRooms: 0,
    notes: "Office space in a prime location.",
    ownerId: "C003",
    ownerName: "Le Van C",
    ownerEmail: "levanc@gmail.com",
    ownerPhone: "0923456789",
    ownerAddress: "789 Hai Ba Trung St, District 1, Ho Chi Minh City",
  },
  {
    id: "4",
    image: "🏖️",
    name: "Beachfront Condo",
    type: "Apartment",
    status: "Negotiating",
    price: 650000,
    agent: "David Lee",
    lastUpdated: "2024-01-17",
    plotWidth: 12,
    plotLength: 18,
    plotArea: 216,
    buildingWidth: 10,
    buildingLength: 15,
    buildingArea: 150,
    direction: "Southeast",
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    livingRooms: 1,
    notes: "Condo with an amazing ocean view.",
    ownerId: "C004",
    ownerName: "Pham Thi D",
    ownerEmail: "phamthid@gmail.com",
    ownerPhone: "0934567890",
    ownerAddress: "321 Tran Hung Dao St, District 5, Ho Chi Minh City",
  },
  {
    id: "5",
    image: "🌳",
    name: "Residential Land Plot",
    type: "Land",
    status: "Paused",
    price: 280000,
    agent: "Emma Wilson",
    lastUpdated: "2024-01-19",
    plotWidth: 15,
    plotLength: 25,
    plotArea: 375,
    buildingWidth: 0,
    buildingLength: 0,
    buildingArea: 0,
    direction: "North",
    floors: 0,
    bedrooms: 0,
    bathrooms: 0,
    livingRooms: 0,
    notes: "Project land plot with separate ownership certificate.",
    ownerId: "C005",
    ownerName: "Hoang Van E",
    ownerEmail: "hoangvane@gmail.com",
    ownerPhone: "0945678901",
    ownerAddress: "654 Cach Mang Thang 8 St, District 10, Ho Chi Minh City",
  },
  {
    id: "6",
    image: "🏠",
    name: "Modern Urban Townhouse",
    type: "House",
    status: "Closed",
    price: 580000,
    agent: "Frank Brown",
    lastUpdated: "2024-01-10",
    plotWidth: 8,
    plotLength: 20,
    plotArea: 160,
    buildingWidth: 7,
    buildingLength: 18,
    buildingArea: 126,
    direction: "West",
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    notes: "Modern townhouse with a premium design.",
    ownerId: "C006",
    ownerName: "Vu Thi F",
    ownerEmail: "vuthif@gmail.com",
    ownerPhone: "0956789012",
    ownerAddress: "987 Nguyen Thi Minh Khai St, District 3, Ho Chi Minh City",
  },
];

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
  const property = propertiesData.find((p) => p.id === params.propertyId);

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
