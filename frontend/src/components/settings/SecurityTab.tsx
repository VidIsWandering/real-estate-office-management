"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type TwoFAMethod = "email" | "authenticator";

export function SecurityTab() {
  /* ================= CHANGE PASSWORD ================= */
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handlePasswordChange = () => {
    setError(null);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(passwordData.newPassword)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      );
      return;
    }

    console.log("CHANGE PASSWORD:", passwordData);
    setShowChangePassword(false);
  };

  /* ================= TWO FACTOR AUTH ================= */
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAPending, setTwoFAPending] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<TwoFAMethod | null>(null);
  const [show2FAVerify, setShow2FAVerify] = useState(false);
  const [otp, setOtp] = useState("");

  const handleToggle2FA = (checked: boolean) => {
    if (checked) {
      // Start enable flow
      setTwoFAPending(true);
    } else {
      if (confirm("Disable Two-Factor Authentication?")) {
        setTwoFAEnabled(false);
        setTwoFAPending(false);
        setTwoFAMethod(null);
        console.log("2FA DISABLED");
      }
    }
  };

  const startEnable2FA = (method: TwoFAMethod) => {
    setTwoFAMethod(method);
    setShow2FAVerify(true);
  };

  const verify2FA = () => {
    if (otp.length !== 6) {
      alert("Invalid verification code");
      return;
    }

    console.log("VERIFY 2FA:", { otp, twoFAMethod });
    // TODO: API verify

    setTwoFAEnabled(true);
    setTwoFAPending(false);
    setShow2FAVerify(false);
    setOtp("");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-8 max-w-xl">
      <h2 className="text-xl font-semibold">Security Settings</h2>

      {/* ===== Change Password ===== */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">Change Password</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Cancel" : "Update"}
          </Button>
        </div>

        {showChangePassword && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordChange}>Save Password</Button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Two Factor Authentication ===== */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Two-Factor Authentication (2FA)</p>
            <p className="text-sm text-gray-500">
              Add an extra layer of security
            </p>
          </div>

          <Switch
            checked={twoFAEnabled || twoFAPending}
            onCheckedChange={handleToggle2FA}
          />
        </div>

        {twoFAEnabled && (
          <p className="text-sm text-green-600">
            ✓ 2FA is enabled ({twoFAMethod})
          </p>
        )}

        {twoFAPending && !twoFAEnabled && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEnable2FA("email")}
            >
              Email OTP
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEnable2FA("authenticator")}
            >
              Authenticator App
            </Button>
          </div>
        )}
      </div>

      {/* ===== Verify OTP ===== */}
      <Dialog open={show2FAVerify} onOpenChange={setShow2FAVerify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify 2FA</DialogTitle>
          </DialogHeader>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FAVerify(false)}>
              Cancel
            </Button>
            <Button onClick={verify2FA}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
