"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  getAllPermissions,
  updatePermissions,
  type PermissionMatrix,
} from "@/lib/api";
import { CatalogList } from "./CatalogList";

type RoleKey = "agent" | "legal_officer" | "accountant";

type PermissionKey = "view" | "add" | "edit" | "delete";

const roles: Array<{ key: RoleKey; label: string }> = [
  { key: "agent", label: "Agent" },
  { key: "legal_officer", label: "Legal Officer" },
  { key: "accountant", label: "Accountant" },
];

const forms: Array<{ key: string; label: string }> = [
  { key: "transactions", label: "Transactions" },
  { key: "contracts", label: "Contracts" },
  { key: "payments", label: "Payments" },
  { key: "properties", label: "Properties" },
  { key: "partners", label: "Partners" },
  { key: "staff", label: "Staff" },
];

export function ConfigTab() {
  const [role, setRole] = useState<RoleKey>("agent");
  const [permissions, setPermissions] = useState<PermissionMatrix>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load permissions on mount
  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllPermissions();
      setPermissions(response.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load permissions"
      );
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = useMemo(
    () => roles.find((r) => r.key === role)?.label ?? role,
    [role]
  );

  const setPermission = (
    resource: string,
    permission: PermissionKey,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [resource]: {
          ...(prev[role]?.[resource] || {}),
          [permission]: value,
        },
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);
      await updatePermissions(permissions);
      // Reload from backend to confirm save
      await loadPermissions();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to save permissions"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-1">
        <h2 className="text-xl font-semibold">Config</h2>
        <p className="text-sm text-gray-600">
          Manage catalogs and role permissions. (Manager configuration)
        </p>
      </div>

      {/* Catalogs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CatalogList
          title="Property types"
          type="property_type"
          addPlaceholder="Add a property type..."
        />

        <CatalogList
          title="Areas"
          type="area"
          addPlaceholder="Add an area..."
        />

        <CatalogList
          title="Lead sources"
          type="lead_source"
          addPlaceholder="Add a source..."
        />

        <CatalogList
          title="Contract types"
          type="contract_type"
          addPlaceholder="Add a contract type..."
        />
      </div>

      {/* Permissions Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Role permissions
            </h3>
            <p className="text-sm text-gray-600">
              Configure View/Add/Edit/Delete per form for: {roleLabel}
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Label className="sr-only" htmlFor="role">
              Role
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as RoleKey)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.key} value={r.key}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600 py-4">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
            <Button onClick={loadPermissions} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                      Form (BM)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                      View
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                      Add
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                      Edit
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {forms.map((form) => {
                    const current = permissions[role]?.[form.key] || {};
                    return (
                      <tr key={form.key} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {form.label}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={Boolean(current.view)}
                              onCheckedChange={(v) =>
                                setPermission(form.key, "view", Boolean(v))
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={Boolean(current.add)}
                              onCheckedChange={(v) =>
                                setPermission(form.key, "add", Boolean(v))
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={Boolean(current.edit)}
                              onCheckedChange={(v) =>
                                setPermission(form.key, "edit", Boolean(v))
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={Boolean(current.delete)}
                              onCheckedChange={(v) =>
                                setPermission(form.key, "delete", Boolean(v))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">
                      Permissions saved successfully
                    </span>
                  </div>
                )}
              </div>
              <Button onClick={handleSavePermissions} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Permissions"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
