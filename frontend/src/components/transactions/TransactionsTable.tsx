"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  cancelTransaction,
  finalizeTransaction,
  getTransactionsList,
  getTransactionById,
  Transaction,
  TransactionStatus,
  Term,
  updateTransaction,
} from "@/lib/api/transactions";

const statusColor = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
} as const;

type StatusColor = keyof typeof statusColor;

function getStatusMeta(status: TransactionStatus): {
  label: string;
  color: StatusColor;
} {
  switch (status) {
    case "negotiating":
      return { label: "Negotiating", color: "yellow" };
    case "pending_contract":
      return { label: "Awaiting Contract Signing", color: "blue" };
    case "cancelled":
      return { label: "Cancelled", color: "red" };
    default:
      return { label: status, color: "green" };
  }
}

function formatOfferPrice(value: number | string): string {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(n)) return n.toLocaleString("vi-VN");
  return String(value);
}

export function TransactionsTable({
  status,
  search,
  refreshKey,
}: {
  status?: TransactionStatus;
  search?: string;
  refreshKey?: number;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editOfferPrice, setEditOfferPrice] = useState<string>("");
  const [editTerms, setEditTerms] = useState<Term[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [items, setItems] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [internalRefreshKey, setInternalRefreshKey] = useState(0);

  const normalizedSearch = (search ?? "").trim().toLowerCase();

  useEffect(() => {
    setPage(1);
  }, [status, normalizedSearch, refreshKey, internalRefreshKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getTransactionsList({ page, limit, status });
        if (cancelled) return;

        setItems(res.data);
        setTotalPages(res.pagination.totalPages || 1);
      } catch (err) {
        console.error("Failed to load transactions", err);
        if (!cancelled) {
          setItems([]);
          setTotalPages(1);
          setError(
            err instanceof Error ? err.message : "Failed to load transactions",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, limit, status, refreshKey, internalRefreshKey]);

  const rows = useMemo(() => {
    const filtered = !normalizedSearch
      ? items
      : items.filter((t) => {
          const haystack = [
            String(t.id),
            String(t.client_id),
            String(t.staff_id),
            String(t.real_estate_id),
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedSearch);
        });

    return filtered.map((t) => {
      const meta = getStatusMeta(t.status);
      return { t, meta };
    });
  }, [items, normalizedSearch]);

  const openDetails = (t: Transaction) => {
    setSelected(t);
    setOpen(true);
  };

  const openEdit = async (id: number) => {
    setIsEditOpen(true);
    setEditingId(id);
    setEditError(null);
    setEditLoading(true);

    try {
      const res = await getTransactionById(id);
      const tx = res.data.transaction;

      setEditOfferPrice(String(tx.offer_price ?? ""));
      setEditTerms(Array.isArray(tx.terms) ? tx.terms : []);
    } catch (err) {
      console.error("Failed to load transaction for edit", err);
      setEditError(
        err instanceof Error ? err.message : "Failed to load transaction",
      );
      setEditOfferPrice("");
      setEditTerms([]);
    } finally {
      setEditLoading(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setEditError(null);

    const price = Number(editOfferPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setEditError("Offer price must be a positive number");
      return;
    }

    try {
      setEditLoading(true);
      await updateTransaction(editingId, {
        offer_price: price,
        terms: editTerms.map((t) => ({
          id: t.id,
          name: t.name,
          content: t.content,
        })),
      });

      setIsEditOpen(false);
      setEditingId(null);
      setInternalRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Failed to update transaction", err);
      setEditError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  const doFinalize = async (id: number) => {
    const ok = confirm(
      "Finalize this transaction? Status will move to PENDING (pending_contract).",
    );
    if (!ok) return;

    try {
      await finalizeTransaction(id);
      setInternalRefreshKey((k) => k + 1);
      setOpen(false);
      setSelected(null);
    } catch (err) {
      console.error("Failed to finalize transaction", err);
      alert(err instanceof Error ? err.message : "Failed to finalize");
    }
  };

  const doCancel = async (id: number) => {
    const ok = confirm(
      "Cancel this transaction? Status will move to CANCELLED and the real estate will be set back to LISTED.",
    );
    if (!ok) return;

    const reason = prompt("Cancellation reason (optional):", "") ?? "";

    try {
      await cancelTransaction(id, reason.trim() || undefined);
      setInternalRefreshKey((k) => k + 1);
      setOpen(false);
      setSelected(null);
    } catch (err) {
      console.error("Failed to cancel transaction", err);
      alert(err instanceof Error ? err.message : "Failed to cancel");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Offer price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-red-600">
                {error}
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            rows.map(({ t, meta }) => (
              <TableRow
                key={t.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openDetails(t)}
              >
                <TableCell className="font-medium">#{t.id}</TableCell>
                <TableCell>Client #{t.client_id}</TableCell>
                <TableCell>Staff #{t.staff_id}</TableCell>
                <TableCell className="font-semibold">
                  {formatOfferPrice(t.offer_price)}
                </TableCell>

                <TableCell>
                  <Badge className={statusColor[meta.color]}>
                    {meta.label}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(t);
                      }}
                      aria-label="View details"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Backend only allows updates while status = negotiating
                        if (t.status !== "negotiating") return;
                        void openEdit(t.id);
                      }}
                      aria-label="Edit"
                      title="Edit"
                      disabled={t.status !== "negotiating"}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (t.status !== "negotiating") return;
                        void doFinalize(t.id);
                      }}
                      aria-label="Finalize"
                      title="Finalize"
                      disabled={t.status !== "negotiating"}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (t.status !== "negotiating") return;
                        void doCancel(t.id);
                      }}
                      aria-label="Cancel"
                      title="Cancel"
                      disabled={t.status !== "negotiating"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
        <div className="text-gray-600">
          Page {page} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Transaction ID</div>
                <div className="font-medium">#{selected.id}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <Badge
                  className={statusColor[getStatusMeta(selected.status).color]}
                >
                  {getStatusMeta(selected.status).label}
                </Badge>
              </div>

              <div>
                <div className="text-xs text-gray-500">Real estate</div>
                <div className="font-medium">
                  Real Estate #{selected.real_estate_id}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Offer price</div>
                <div className="font-medium">
                  {formatOfferPrice(selected.offer_price)}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Client</div>
                <div className="font-medium">Client #{selected.client_id}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Staff</div>
                <div className="font-medium">Staff #{selected.staff_id}</div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-500">Terms</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {Array.isArray(selected.terms) && selected.terms.length > 0
                    ? selected.terms.join(", ")
                    : "(none)"}
                </div>
              </div>

              {selected.status === "cancelled" &&
              selected.cancellation_reason ? (
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500">
                    Cancellation reason
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selected.cancellation_reason}
                  </div>
                </div>
              ) : null}

              {selected.status === "negotiating" ? (
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => doCancel(selected.id)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => doFinalize(selected.id)}>
                    Finalize (pending_contract)
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
          </DialogHeader>

          {editError ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {editError}
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500">Offer price</div>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={editOfferPrice}
                onChange={(e) => setEditOfferPrice(e.target.value)}
                inputMode="decimal"
                disabled={editLoading}
              />
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2">Terms</div>
              {editLoading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : editTerms.length === 0 ? (
                <div className="text-sm text-gray-500">(no terms)</div>
              ) : (
                <div className="space-y-3">
                  {editTerms.map((term) => (
                    <div key={term.id} className="rounded-md border p-3">
                      <div className="text-xs text-gray-500">Name</div>
                      <input
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        value={term.name}
                        onChange={(e) =>
                          setEditTerms((prev) =>
                            prev.map((t) =>
                              t.id === term.id
                                ? { ...t, name: e.target.value }
                                : t,
                            ),
                          )
                        }
                        disabled={editLoading}
                      />

                      <div className="text-xs text-gray-500 mt-3">Content</div>
                      <textarea
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
                        value={term.content ?? ""}
                        onChange={(e) =>
                          setEditTerms((prev) =>
                            prev.map((t) =>
                              t.id === term.id
                                ? { ...t, content: e.target.value }
                                : t,
                            ),
                          )
                        }
                        disabled={editLoading}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button onClick={saveEdit} disabled={editLoading || !editingId}>
                {editLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
