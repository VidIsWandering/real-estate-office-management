"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PaymentForm() {
    const [, setContractId] = useState("");
    const [voucherType, setVoucherType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [, setStaffId] = useState("");
    const [status, setStatus] = useState("");

    return (
        <div className="space-y-8">
            {/* Payment Voucher Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Voucher details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Voucher ID</label>
                        <Input disabled placeholder="Auto-generated" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Related contract</label>
                        <Select onValueChange={setContractId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a contract..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HD001">HD001 - Sale & purchase - Nguyễn Văn A</SelectItem>
                                <SelectItem value="HD002">HD002 - Deposit agreement - Trần Thị B</SelectItem>
                                <SelectItem value="HD003">HD003 - Lease agreement - Lê Văn C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600 mb-2 block">Voucher type</label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="receipt" 
                                    checked={voucherType === "receipt"}
                                    onCheckedChange={(checked) => checked && setVoucherType("receipt")}
                                />
                                <Label htmlFor="receipt" className="text-sm font-normal">
                                    Receipt
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="payment" 
                                    checked={voucherType === "payment"}
                                    onCheckedChange={(checked) => checked && setVoucherType("payment")}
                                />
                                <Label htmlFor="payment" className="text-sm font-normal">
                                    Payment
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Payment details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Payment date</label>
                        <Input type="date" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Amount</label>
                        <Input placeholder="e.g., 100,000,000" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Payer/Payee</label>
                        <Input placeholder="Enter payer/payee name" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600 mb-2 block">Payment method</label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="cash" 
                                    checked={paymentMethod === "cash"}
                                    onCheckedChange={(checked) => checked && setPaymentMethod("cash")}
                                />
                                <Label htmlFor="cash" className="text-sm font-normal">
                                    Cash
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="transfer" 
                                    checked={paymentMethod === "transfer"}
                                    onCheckedChange={(checked) => checked && setPaymentMethod("transfer")}
                                />
                                <Label htmlFor="transfer" className="text-sm font-normal">
                                    Bank transfer
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600">Description</label>
                        <Textarea rows={4} placeholder="Enter payment description..." />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Supporting documents</label>
                        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                </CardContent>
            </Card>

            {/* Management Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Administration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Created by</label>
                        <Select onValueChange={setStaffId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select staff..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NV001">NV001 - Nguyễn Văn A</SelectItem>
                                <SelectItem value="NV002">NV002 - Trần Thị B</SelectItem>
                                <SelectItem value="NV003">NV003 - Lê Văn C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600 mb-2 block">Status</label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-new" 
                                    checked={status === "new"}
                                    onCheckedChange={(checked) => checked && setStatus("new")}
                                />
                                <Label htmlFor="status-new" className="text-sm font-normal">
                                    Created
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-confirmed" 
                                    checked={status === "confirmed"}
                                    onCheckedChange={(checked) => checked && setStatus("confirmed")}
                                />
                                <Label htmlFor="status-confirmed" className="text-sm font-normal">
                                    Confirmed
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-center gap-3">
                        <Button className="bg-primary text-white px-8">
                            Save
                        </Button>
                        <Button variant="outline" className="px-8">
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
