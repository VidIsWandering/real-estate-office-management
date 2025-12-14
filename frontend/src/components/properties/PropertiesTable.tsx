import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Property {
  id: string;
  image: string;
  name: string;
  type: "Apartment" | "House" | "Land" | "Commercial";
  status: "Available" | "For Sale" | "Sold" | "Rented";
  price: number;
  agent: string;
  lastUpdated: string;
}

const properties: Property[] = [
  {
    id: "1",
    image: "🏢",
    name: "Downtown Luxury Penthouse",
    type: "Apartment",
    status: "For Sale",
    price: 950000,
    agent: "Alice Chen",
    lastUpdated: "2024-01-15",
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
  },
];

function getStatusColor(status: Property["status"]) {
  const colors = {
    Available: "bg-green-50 text-green-700",
    "For Sale": "bg-blue-50 text-blue-700",
    Sold: "bg-gray-50 text-gray-700",
    Rented: "bg-purple-50 text-purple-700",
  };
  return colors[status];
}

interface PropertyTableProps {
  searchTerm: string;
  filterStatus: string;
  filterType: string;
}

export function PropertyTable({
  searchTerm,
  filterStatus,
  filterType,
}: PropertyTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || prop.status === filterStatus;
    const matchesType = filterType === "all" || prop.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(
    startIndex,
    startIndex + itemsPerPage
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
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
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
                        property.status
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
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
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
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProperties.length)} of{" "}
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
