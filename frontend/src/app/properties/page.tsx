"use client";

import { PropertyTable } from "@/components/properties/PropertiesTable";
import { PropertySummary } from "@/components/properties/PropertiesSummary";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

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
            <option value="Available">Available</option>
            <option value="For Sale">For Sale</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
          </select>
        </div>

        {/* Add Property Button */}
        <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm">
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table - Left side */}
        <div className="lg:col-span-2">
          <PropertyTable
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterType={filterType}
          />
        </div>

        {/* Summary - Right side */}
        <div>
          <PropertySummary />
        </div>
      </div>
    </>
  );
}
