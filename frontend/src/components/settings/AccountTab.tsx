"use client";

export function AccountTab() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-6">

        {/* LEFT SIDE MENU */}
        <div className="flex flex-col gap-2 w-40">
          <button className="text-sm font-medium text-primary">Profile</button>
          <button className="text-sm text-gray-500 hover:text-gray-700">Information</button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">JaneDoe</h2>
              <p className="text-sm text-gray-500">Office Manager</p>
            </div>

            <div className="flex gap-4 text-sm text-primary cursor-pointer">
              <button>Edit</button>
              <button>Profile</button>
            </div>
          </div>

          {/* DETAILS CARD */}
          <div className="border rounded-lg p-4 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <p>📧 jane.doe@realestate.com</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Phone</p>
              <p>📞 ( ___ ) ___ – ____</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Role</p>
              <p>Office Manager</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">Member Since</p>
              <p>January, 2024</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
