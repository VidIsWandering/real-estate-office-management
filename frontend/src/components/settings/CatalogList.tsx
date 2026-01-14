"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import {
  getCatalogsByType,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  type Catalog,
} from "@/lib/api";

interface CatalogListProps {
  title: string;
  type: Catalog["type"];
  addPlaceholder: string;
}

export function CatalogList({ title, type, addPlaceholder }: CatalogListProps) {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load catalogs on mount
  useEffect(() => {
    loadCatalogs();
  }, [type]);

  const loadCatalogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCatalogsByType(type);
      setCatalogs(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load catalogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const value = newValue.trim();
    if (!value) return;

    try {
      setSubmitting(true);
      const response = await createCatalog({ type, value });
      setCatalogs([response.data, ...catalogs]);
      setNewValue("");
    } catch (err: any) {
      alert(err.message || "Failed to add catalog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (catalog: Catalog) => {
    setEditingId(catalog.id);
    setEditingValue(catalog.value);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleSaveEdit = async () => {
    if (editingId === null) return;

    const value = editingValue.trim();
    if (!value) return;

    try {
      setSubmitting(true);
      const response = await updateCatalog(editingId, { value });
      setCatalogs(
        catalogs.map((c) => (c.id === editingId ? response.data : c))
      );
      handleCancelEdit();
    } catch (err: any) {
      alert(err.message || "Failed to update catalog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catalog: Catalog) => {
    const ok = window.confirm(`Delete "${catalog.value}"?`);
    if (!ok) return;

    try {
      setSubmitting(true);
      await deleteCatalog(catalog.id);
      setCatalogs(catalogs.filter((c) => c.id !== catalog.id));
      if (editingId === catalog.id) {
        handleCancelEdit();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete catalog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center gap-2 text-red-600 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
        <Button onClick={loadCatalogs} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={addPlaceholder}
          disabled={submitting}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !newValue.trim()}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
        </Button>
      </div>

      <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
        {catalogs.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No items yet.</div>
        ) : (
          catalogs.map((catalog) => {
            const isEditing = editingId === catalog.id;
            const canSave = isEditing && editingValue.trim().length > 0;

            return (
              <div
                key={catalog.id}
                className="flex items-center justify-between gap-3 p-3"
              >
                {isEditing ? (
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    disabled={submitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canSave) handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                ) : (
                  <div className="text-sm text-gray-800">{catalog.value}</div>
                )}

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={!canSave || submitting}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded disabled:opacity-50"
                        title="Save"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={submitting}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(catalog)}
                      disabled={submitting}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(catalog)}
                    disabled={submitting}
                    className="p-1.5 text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
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
