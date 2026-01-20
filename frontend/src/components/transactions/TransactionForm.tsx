"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createTransaction } from "@/lib/api/transactions";
import { getClientOptions } from "@/lib/api/clients";
import { getRealEstatesList } from "@/lib/api/real-estates";

type Option = { id: number; label: string };

export function TransactionForm({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [offerPrice, setOfferPrice] = useState("");
  const [realEstateId, setRealEstateId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [initialTerms, setInitialTerms] = useState("");

  const [propertyOptions, setPropertyOptions] = useState<Option[]>([]);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingOptions(true);

    (async () => {
      try {
        const [clientsRes, realEstatesRes] = await Promise.all([
          getClientOptions({ page: 1, limit: 100 }),
          getRealEstatesList({ page: 1, limit: 100 }),
        ]);

        if (cancelled) return;

        setClientOptions(
          clientsRes.data.map((c) => ({ id: c.id, label: c.full_name })),
        );
        setPropertyOptions(
          realEstatesRes.data.map((re) => ({ id: re.id, label: re.title })),
        );
      } catch (err) {
        console.error("Failed to load transaction form options", err);
        if (!cancelled) {
          setClientOptions([]);
          setPropertyOptions([]);
        }
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    const price = Number(offerPrice);
    return (
      realEstateId.trim() !== "" &&
      clientId.trim() !== "" &&
      offerPrice.trim() !== "" &&
      Number.isFinite(price) &&
      price > 0
    );
  }, [offerPrice, realEstateId, clientId]);

  const handleSubmit = async () => {
    setError(null);

    const price = Number(offerPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Offer price must be a positive number");
      return;
    }
    if (!realEstateId) {
      setError("Please select a property");
      return;
    }
    if (!clientId) {
      setError("Please select a client");
      return;
    }

    const terms = initialTerms.trim()
      ? [{ name: "Initial agreement", content: initialTerms.trim() }]
      : [];

    try {
      setSubmitting(true);

      await createTransaction({
        real_estate_id: Number(realEstateId),
        client_id: Number(clientId),
        offer_price: price,
        terms,
      });

      onCreated();
    } catch (err) {
      console.error("Failed to create transaction", err);
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1 max-h-[80vh] overflow-y-auto custom-scrollbar">
      {/* Container chính: Chia 2 vùng theo hàng dọc để đảm bảo không bị chồng lấn trong Modal */}
      <div className="flex flex-col gap-8">
        {/* SECTION 1: Transaction Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Transaction details
          </h3>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Offer price
              </label>
              <Input
                placeholder="e.g., 8500000000"
                inputMode="decimal"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Property (BM3)
              </label>
              <Select value={realEstateId} onValueChange={setRealEstateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    propertyOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Customer (BM2)
              </label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer..." />
                </SelectTrigger>
                <SelectContent>
                  {loadingOptions ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    clientOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Initial agreement notes
            </label>
            <Textarea
              placeholder="Enter preliminary terms..."
              className="min-h-[100px] resize-none"
              value={initialTerms}
              onChange={(e) => setInitialTerms(e.target.value)}
            />
          </div>
        </section>

        {/* SECTION 2: Status & Actions */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Transaction status
          </h3>

          <div className="p-4 bg-slate-50 rounded-lg border">
            <div className="text-sm font-medium">Negotiating</div>
            <div className="text-xs text-muted-foreground mt-1">
              Status is set by the system on creation.
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER: Nút bấm cố định bên dưới */}
      <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
        <Button
          variant="outline"
          className="min-w-[100px]"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          className="min-w-[100px] bg-slate-900 text-white hover:bg-slate-800"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
