"use client";

import {
  ArrowLeft,
  Home,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
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
  status: "Available" | "For Sale" | "Sold" | "Rented";
  price: number;
  agent: string;
  lastUpdated: string;
  // Thông tin khuôn viên
  plotWidth: number; // mét
  plotLength: number; // mét
  plotArea: number; // m²
  // Thông tin xây dựng
  buildingWidth: number; // mét
  buildingLength: number; // mét
  buildingArea: number; // m²
  // Thông tin chi tiết
  direction: string; // Hướng
  floors: number; // Số tầng
  bedrooms: number; // Phòng ngủ
  bathrooms: number; // Phòng tắm
  livingRooms: number; // Phòng khách
  notes: string; // Ghi chú
  // Thông tin chủ sở hữu
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
    status: "For Sale",
    price: 950000,
    agent: "Alice Chen",
    lastUpdated: "2024-01-15",
    plotWidth: 20,
    plotLength: 30,
    plotArea: 600,
    buildingWidth: 15,
    buildingLength: 25,
    buildingArea: 375,
    direction: "Đông Nam",
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    livingRooms: 2,
    notes: "Căn hộ cao cấp với view đẹp, nội thất sang trọng",
    ownerId: "C001",
    ownerName: "Nguyễn Văn A",
    ownerEmail: "nguyenvana@gmail.com",
    ownerPhone: "0901234567",
    ownerAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  },
  {
    id: "2",
    image: "🏠",
    name: "Suburban Family Home",
    type: "House",
    status: "Available",
    price: 425000,
    agent: "Bob Smith",
    lastUpdated: "2024-01-18",
    plotWidth: 10,
    plotLength: 20,
    plotArea: 200,
    buildingWidth: 8,
    buildingLength: 15,
    buildingArea: 120,
    direction: "Nam",
    floors: 1,
    bedrooms: 3,
    bathrooms: 2,
    livingRooms: 1,
    notes: "Nhà mới xây, khu vực yên tĩnh",
    ownerId: "C002",
    ownerName: "Trần Thị B",
    ownerEmail: "tranthib@gmail.com",
    ownerPhone: "0912345678",
    ownerAddress: "456 Lê Lợi, Quận 3, TP.HCM",
  },
  {
    id: "3",
    image: "🏢",
    name: "Commercial Office Space",
    type: "Commercial",
    status: "For Sale",
    price: 1200000,
    agent: "Carol Davis",
    lastUpdated: "2024-01-20",
    plotWidth: 25,
    plotLength: 40,
    plotArea: 1000,
    buildingWidth: 20,
    buildingLength: 35,
    buildingArea: 700,
    direction: "Đông",
    floors: 3,
    bedrooms: 0,
    bathrooms: 4,
    livingRooms: 0,
    notes: "Văn phòng cho thuê, vị trí đẹp",
    ownerId: "C003",
    ownerName: "Lê Văn C",
    ownerEmail: "levanc@gmail.com",
    ownerPhone: "0923456789",
    ownerAddress: "789 Hai Bà Trưng, Quận 1, TP.HCM",
  },
  {
    id: "4",
    image: "🏖️",
    name: "Beachfront Condo",
    type: "Apartment",
    status: "Rented",
    price: 650000,
    agent: "David Lee",
    lastUpdated: "2024-01-17",
    plotWidth: 12,
    plotLength: 18,
    plotArea: 216,
    buildingWidth: 10,
    buildingLength: 15,
    buildingArea: 150,
    direction: "Đông Nam",
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    livingRooms: 1,
    notes: "Căn hộ view biển tuyệt đẹp",
    ownerId: "C004",
    ownerName: "Phạm Thị D",
    ownerEmail: "phamthid@gmail.com",
    ownerPhone: "0934567890",
    ownerAddress: "321 Trần Hưng Đạo, Quận 5, TP.HCM",
  },
  {
    id: "5",
    image: "🌳",
    name: "Residential Land Plot",
    type: "Land",
    status: "Available",
    price: 280000,
    agent: "Emma Wilson",
    lastUpdated: "2024-01-19",
    plotWidth: 15,
    plotLength: 25,
    plotArea: 375,
    buildingWidth: 0,
    buildingLength: 0,
    buildingArea: 0,
    direction: "Bắc",
    floors: 0,
    bedrooms: 0,
    bathrooms: 0,
    livingRooms: 0,
    notes: "Đất nền dự án, sổ hồng riêng",
    ownerId: "C005",
    ownerName: "Hoàng Văn E",
    ownerEmail: "hoangvane@gmail.com",
    ownerPhone: "0945678901",
    ownerAddress: "654 Cách Mạng Tháng 8, Quận 10, TP.HCM",
  },
  {
    id: "6",
    image: "🏠",
    name: "Modern Urban Townhouse",
    type: "House",
    status: "Sold",
    price: 580000,
    agent: "Frank Brown",
    lastUpdated: "2024-01-10",
    plotWidth: 8,
    plotLength: 20,
    plotArea: 160,
    buildingWidth: 7,
    buildingLength: 18,
    buildingArea: 126,
    direction: "Tây",
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    livingRooms: 1,
    notes: "Nhà phố hiện đại, thiết kế sang trọng",
    ownerId: "C006",
    ownerName: "Vũ Thị F",
    ownerEmail: "vuthif@gmail.com",
    ownerPhone: "0956789012",
    ownerAddress: "987 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
  },
];

function getStatusColor(status: Property["status"]) {
  const colors = {
    Available: "bg-green-100 text-green-800",
    "For Sale": "bg-blue-100 text-blue-800",
    Sold: "bg-gray-100 text-gray-800",
    Rented: "bg-purple-100 text-purple-800",
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
                Thông tin cơ bản
              </h2>
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loại:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá:</span>
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
                  <span className="text-sm text-gray-600">Cập nhật:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {property.lastUpdated}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin khuôn viên */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Maximize className="w-5 h-5" />
                Thông tin khuôn viên
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Chiều rộng:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.plotWidth} m
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Chiều dài:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.plotLength} m
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Diện tích:</p>
                  <p className="text-lg font-bold text-blue-900">
                    {property.plotArea} m²
                  </p>
                </div>
              </div>
            </div>

            {/* Thông tin xây dựng */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Thông tin xây dựng
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Chiều rộng:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.buildingWidth} m
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Chiều dài:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {property.buildingLength} m
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Diện tích:</p>
                  <p className="text-lg font-bold text-green-900">
                    {property.buildingArea} m²
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Thông tin chi tiết */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin chi tiết
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Hướng:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.direction}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Số tầng:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.floors} tầng
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phòng ngủ:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bedrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phòng tắm:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.bathrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sofa className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phòng khách:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {property.livingRooms}
                  </span>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <StickyNote className="w-5 h-5" />
                Ghi chú
              </h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">{property.notes}</p>
              </div>
            </div>

            {/* Thông tin chủ sở hữu */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin chủ sở hữu
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
                  Click để xem chi tiết chủ sở hữu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Edit2 className="w-4 h-4" />
            Chỉnh sửa
          </button>
          <button className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Xóa
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
