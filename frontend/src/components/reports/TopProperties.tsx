"use client";

import { Award, TrendingUp } from "lucide-react";

interface TopProperty {
  id: string;
  name: string;
  location: string;
  price: number;
  rank: number;
}

const topProperties: TopProperty[] = [
  {
    id: "1",
    name: "Luxury Downtown Penthouse",
    location: "Downtown, City",
    price: 2500000,
    rank: 1,
  },
  {
    id: "2",
    name: "Commercial Office Complex",
    location: "Business District",
    price: 2200000,
    rank: 2,
  },
  {
    id: "3",
    name: "Waterfront Estate",
    location: "Waterfront Area",
    price: 1950000,
    rank: 3,
  },
  {
    id: "4",
    name: "Modern Smart Home",
    location: "Suburban Area",
    price: 1680000,
    rank: 4,
  },
  {
    id: "5",
    name: "Luxury Resort Property",
    location: "Beach District",
    price: 1450000,
    rank: 5,
  },
];

export function TopProperties() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">
          Top 5 Highest-Value Properties
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {topProperties.map((property) => (
          <div
            key={property.id}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                {property.rank}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {property.name}
                </p>
                <p className="text-xs text-gray-600">{property.location}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ${(property.price / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <button className="text-sm font-medium text-primary hover:text-blue-600 transition-colors">
          View All Properties →
        </button>
      </div>
    </div>
  );
}
