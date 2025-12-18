"use client";

import { ChevronLeft, ChevronRight, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Property {
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
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lastUpdated: string;
}

function getStatusColor(status: Property["status"]) {
  const colors = {
    "New": "bg-gray-50 text-gray-700",
    "Pending legal review": "bg-blue-50 text-blue-700",
    "Listed": "bg-blue-50 text-blue-700",
    "Negotiating": "bg-purple-50 text-purple-700",
    "Closed": "bg-green-50 text-green-700",
    "Paused": "bg-gray-50 text-gray-700",
  };
  return colors[status];
}

interface PropertyTableProps {
  properties: Property[];
  searchTerm: string;
  filterStatus: string;
  filterType: string;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
}

export function PropertyTable({
  properties,
  searchTerm,
  filterStatus,
  filterType,
  onEditProperty,
  onDeleteProperty,
}: PropertyTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || prop.status === filterStatus;
    const matchesType = filterType === "all" || prop.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Property
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Agent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProperties.map((property) => (
                <tr
                  key={property.id}
                  onClick={() => router.push(`/properties/${property.id}`)}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg">
                        {property.image}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {property.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
                        property.status,
                      )}`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.agent}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.lastUpdated}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/properties/${property.id}`);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProperty(property);
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Edit property"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const ok = window.confirm(
                            `Delete "${property.name}"? This action cannot be undone.`,
                          );
                          if (!ok) return;
                          onDeleteProperty(property.id);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Delete property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredProperties.length)} of{" "}
          {filteredProperties.length} properties
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
