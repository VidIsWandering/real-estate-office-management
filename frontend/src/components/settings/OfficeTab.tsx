"use client";

export function OfficeTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Office Information</h2>

      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500 mb-1">Office Name</p>
          <p>RealEstate HQ</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Region</p>
          <p>Downtown District</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Phone</p>
          <p>📞 (555) 123-4567</p>
        </div>

        <div>
          <p className="text-gray-500 mb-1">Address</p>
          <p>100 Market St, City Center</p>
        </div>
      </div>
    </div>
  );
}
