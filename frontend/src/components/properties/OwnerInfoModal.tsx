import { X, User, Mail, Phone, MapPin, Building, Calendar } from "lucide-react";

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OwnerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner;
}

export function OwnerInfoModal({
  isOpen,
  onClose,
  owner,
}: OwnerInfoModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary to-blue-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Chi tiết chủ sở hữu
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {owner.name}
                </h3>
                <p className="text-sm text-gray-500">ID: {owner.id}</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-4">
              {/* Email */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {owner.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {owner.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {owner.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Thông tin bổ sung
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">
                      Loại khách hàng
                    </p>
                    <p className="text-sm font-medium text-blue-900">Cá nhân</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Trạng thái</p>
                    <p className="text-sm font-medium text-green-900">
                      Hoạt động
                    </p>
                  </div>
                </div>
              </div>

              {/* Properties Owned */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">
                    Bất động sản sở hữu
                  </p>
                </div>
                <p className="text-2xl font-bold text-indigo-900">1 property</p>
                <p className="text-xs text-indigo-600 mt-1">
                  Đang hiển thị trong danh sách
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors">
                Liên hệ
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
