"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Pencil, Save, Trash2, X } from "lucide-react";

type RoleKey = "agent" | "legal" | "accounting";

type PermissionKey = "view" | "add" | "edit" | "delete";

type PermissionSet = Record<PermissionKey, boolean>;

type PermissionMatrix = Record<string, Record<RoleKey, PermissionSet>>;

const roles: Array<{ key: RoleKey; label: string }> = [
  { key: "agent", label: "Agent" },
  { key: "legal", label: "Legal" },
  { key: "accounting", label: "Accounting" },
];

const forms: Array<{ key: string; label: string }> = [
  { key: "transactions", label: "Transactions" },
  { key: "contracts", label: "Contracts" },
  { key: "payments", label: "Vouchers / Payments" },
  { key: "properties", label: "Properties" },
  { key: "partners", label: "Clients / Partners" },
  { key: "staff", label: "Staff" },
];

function createDefaultPermissionSet(): PermissionSet {
  return { view: true, add: false, edit: false, delete: false };
}

function createDefaultMatrix(): PermissionMatrix {
  const matrix: PermissionMatrix = {};
  for (const form of forms) {
    matrix[form.key] = {
      agent: createDefaultPermissionSet(),
      legal: createDefaultPermissionSet(),
      accounting: createDefaultPermissionSet(),
    };
  }
  return matrix;
}

function ConfigListSection({
  title,
  items,
  onChange,
  addPlaceholder,
}: {
  title: string;
  items: string[];
  onChange: (next: string[]) => void;
  addPlaceholder: string;
}) {
  const [newValue, setNewValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const canSaveEdit = editingIndex !== null && editingValue.trim().length > 0;

  const handleAdd = () => {
    const value = newValue.trim();
    if (!value) return;

    const exists = items.some((x) => x.toLowerCase() === value.toLowerCase());
    if (exists) return;

    onChange([value, ...items]);
    setNewValue("");
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(items[index] ?? "");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const nextValue = editingValue.trim();
    if (!nextValue) return;

    const exists = items.some(
      (x, i) =>
        i !== editingIndex && x.toLowerCase() === nextValue.toLowerCase(),
    );
    if (exists) return;

    onChange(items.map((x, i) => (i === editingIndex ? nextValue : x)));
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleDelete = (index: number) => {
    const value = items[index];
    const ok = window.confirm(`Delete "${value}"?`);
    if (!ok) return;

    onChange(items.filter((_, i) => i !== index));

    if (editingIndex === index) {
      handleCancelEdit();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={addPlaceholder}
        />
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>

      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No items yet.</div>
        ) : (
          items.map((item, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={`${item}-${index}`}
                className="flex items-center justify-between gap-3 p-3"
              >
                {isEditing ? (
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-gray-800">{item}</div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={!canSaveEdit}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(index)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-1.5 text-red-700 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function ConfigTab() {
  const [propertyTypes, setPropertyTypes] = useState<string[]>([
    "Apartment",
    "House",
    "Land",
    "Commercial",
  ]);
  const [areas, setAreas] = useState<string[]>([
    "Downtown",
    "Riverside",
    "Westside",
    "North Valley",
  ]);
  const [sources, setSources] = useState<string[]>([
    "Website",
    "Facebook",
    "Referral",
    "Walk-in",
  ]);
  const [contractTypes, setContractTypes] = useState<string[]>([
    "Deposit agreement",
    "Sale & purchase agreement",
    "Lease agreement",
  ]);

  const [role, setRole] = useState<RoleKey>("agent");
  const [permissions, setPermissions] = useState<PermissionMatrix>(() =>
    createDefaultMatrix(),
  );

  const roleLabel = useMemo(
    () => roles.find((r) => r.key === role)?.label ?? role,
    [role],
  );

  const setPermission = (
    formKey: string,
    permission: PermissionKey,
    value: boolean,
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [formKey]: {
        ...prev[formKey],
        [role]: {
          ...prev[formKey][role],
          [permission]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-1">
        <h2 className="text-xl font-semibold">Config</h2>
        <p className="text-sm text-gray-600">
          Manage catalogs and role permissions. (Manager configuration)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigListSection
          title="Property types"
          items={propertyTypes}
          onChange={setPropertyTypes}
          addPlaceholder="Add a property type..."
        />

        <ConfigListSection
          title="Areas"
          items={areas}
          onChange={setAreas}
          addPlaceholder="Add an area..."
        />

        <ConfigListSection
          title="Lead sources"
          items={sources}
          onChange={setSources}
          addPlaceholder="Add a source..."
        />

        <ConfigListSection
          title="Contract types"
          items={contractTypes}
          onChange={setContractTypes}
          addPlaceholder="Add a contract type..."
        />
      </div>

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
                const current = permissions[form.key]?.[role];
                return (
                  <tr key={form.key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {form.label}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={Boolean(current?.view)}
                          onCheckedChange={(v) =>
                            setPermission(form.key, "view", Boolean(v))
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={Boolean(current?.add)}
                          onCheckedChange={(v) =>
                            setPermission(form.key, "add", Boolean(v))
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={Boolean(current?.edit)}
                          onCheckedChange={(v) =>
                            setPermission(form.key, "edit", Boolean(v))
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={Boolean(current?.delete)}
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
      </div>
    </div>
  );
}
