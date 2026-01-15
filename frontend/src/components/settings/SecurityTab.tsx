"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Monitor,
  Smartphone,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  changePassword,
  getLoginHistory,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  type LoginHistory,
  type ActiveSession,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";

export function SecurityTab() {
  /* ================= CHANGE PASSWORD ================= */
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const handlePasswordChange = async () => {
    setPasswordError(null);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError(
        "Password must be at least 6 characters and include uppercase, lowercase, and a number"
      );
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError(null);
      await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });

      setPasswordSuccess(true);
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({ current: false, new: false, confirm: false });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      // Log error details for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Change password error:", err);
      }

      if (err instanceof ApiError) {
        // Check if we have a meaningful message
        const errorMessage =
          err.message && !err.message.startsWith("HTTP ")
            ? err.message
            : err.status === 400
              ? "Current password is incorrect or validation failed"
              : "Failed to change password";
        setPasswordError(errorMessage);
      } else if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError("Failed to change password");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  /* ================= LOGIN HISTORY ================= */
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    loadLoginHistory();
  }, []);

  const loadLoginHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const response = await getLoginHistory();
      setLoginHistory(response.data.slice(0, 10)); // Last 10 logins
    } catch (err: unknown) {
      setHistoryError(
        err instanceof Error ? err.message : "Failed to load login history"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  /* ================= ACTIVE SESSIONS ================= */
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [revokingSession, setRevokingSession] = useState<string | null>(null);

  useEffect(() => {
    loadActiveSessions();
  }, []);

  const loadActiveSessions = async () => {
    try {
      setLoadingSessions(true);
      setSessionsError(null);
      const response = await getActiveSessions();
      setActiveSessions(response.data);
    } catch (err: unknown) {
      setSessionsError(
        err instanceof Error ? err.message : "Failed to load active sessions"
      );
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm("Revoke this session? The user will be logged out.")) return;

    try {
      setRevokingSession(sessionId);
      await revokeSession(sessionId);
      setActiveSessions((sessions) =>
        sessions.filter((s) => s.id !== sessionId)
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke session");
    } finally {
      setRevokingSession(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (
      !confirm(
        "Revoke all other sessions? All other devices will be logged out."
      )
    )
      return;

    try {
      setRevokingSession("all");
      await revokeAllSessions();
      await loadActiveSessions();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to revoke sessions");
    } finally {
      setRevokingSession(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Globe className="w-4 h-4" />;
    if (userAgent.toLowerCase().includes("mobile"))
      return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ===== CHANGE PASSWORD ===== */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Change Password</h3>
            <p className="text-sm text-gray-500">
              Update your account password
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Cancel" : "Update"}
          </Button>
        </div>

        {passwordSuccess && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password changed successfully</span>
          </div>
        )}

        {showChangePassword && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    });
                    setPasswordError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    });
                    setPasswordError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    });
                    setPasswordError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Password"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ===== ACTIVE SESSIONS ===== */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Active Sessions</h3>
            <p className="text-sm text-gray-500">
              Manage devices with access to your account
            </p>
          </div>
          {activeSessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllSessions}
              disabled={revokingSession === "all"}
            >
              {revokingSession === "all" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                "Revoke All Others"
              )}
            </Button>
          )}
        </div>

        {loadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : sessionsError ? (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{sessionsError}</span>
          </div>
        ) : activeSessions.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No active sessions</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="text-gray-500 mt-1">
                    {getDeviceIcon(session.user_agent)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {session.user_agent || "Unknown Device"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.ip_address || "Unknown IP"} •{" "}
                      {formatDate(session.login_at)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Last activity: {formatDate(session.last_activity)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={revokingSession === session.id}
                >
                  {revokingSession === session.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Revoke"
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== LOGIN HISTORY ===== */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Login History</h3>
          <p className="text-sm text-gray-500">
            Recent login activity on your account
          </p>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : historyError ? (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{historyError}</span>
          </div>
        ) : loginHistory.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No login history</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {loginHistory.map((login) => (
              <div key={login.id} className="py-3 flex items-center gap-3">
                <div className="text-gray-500">
                  {getDeviceIcon(login.user_agent)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{formatDate(login.login_at)}</p>
                  <p className="text-xs text-gray-500">
                    {login.ip_address || "Unknown IP"} •{" "}
                    {login.user_agent || "Unknown Device"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
