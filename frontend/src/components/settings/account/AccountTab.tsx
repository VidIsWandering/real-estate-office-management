"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, User } from "lucide-react";

export function AccountTab() {
  const router = useRouter();

  return (
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Jane Doe</h2>
            <p className="text-sm text-gray-500">Office Manager</p>
          </div>

          <div className="flex gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                    router.push("/settings/account?mode=profile")
                }
            >
              <User className="w-4 h-4 mr-1" />
              Profile
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                    router.push("/settings/account?mode=edit")
                }
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p>jane.doe@realestate.com</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p>0909 123 456</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p>Office Manager</p>
          </div>
          <div>
            <p className="text-gray-500">Member Since</p>
            <p>January 2024</p>
          </div>
        </div>
      </div>
  );
}
