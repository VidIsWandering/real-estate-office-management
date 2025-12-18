"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ContractForm() {
    const [, setTransactionId] = useState("");
    const [contractType, setContractType] = useState("");
    const [contractStatus, setContractStatus] = useState("");
    const [, setLegalStaffId] = useState("");

    return (
        <div className="space-y-8">
            {/* Contract Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Contract details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Contract ID</label>
                        <Input disabled placeholder="Auto-generated" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Related transaction (BM5)</label>
                        <Select onValueChange={setTransactionId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a transaction..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GD001">GD001 - Nguyễn Văn A - Nhà phố Quận 1</SelectItem>
                                <SelectItem value="GD002">GD002 - Trần Thị B - Căn hộ Quận 7</SelectItem>
                                <SelectItem value="GD003">GD003 - Lê Văn C - Biệt thự Thủ Đức</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600 mb-2 block">Contract type</label>
                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="deposit" 
                                    checked={contractType === "deposit"}
                                    onCheckedChange={(checked) => checked && setContractType("deposit")}
                                />
                                <Label htmlFor="deposit" className="text-sm font-normal">
                                    Deposit agreement
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="sale" 
                                    checked={contractType === "sale"}
                                    onCheckedChange={(checked) => checked && setContractType("sale")}
                                />
                                <Label htmlFor="sale" className="text-sm font-normal">
                                    Sale & purchase agreement
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="lease" 
                                    checked={contractType === "lease"}
                                    onCheckedChange={(checked) => checked && setContractType("lease")}
                                />
                                <Label htmlFor="lease" className="text-sm font-normal">
                                    Lease agreement
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Party Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Parties</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-700">Party A (Seller/Lessor)</h3>
                        <div>
                            <label className="text-sm text-gray-600">Owner</label>
                            <Input disabled placeholder="Auto-filled from transaction" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Phone number</label>
                            <Input disabled placeholder="Auto-filled" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Address</label>
                            <Input disabled placeholder="Auto-filled" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-700">Party B (Buyer/Tenant)</h3>
                        <div>
                            <label className="text-sm text-gray-600">Customer</label>
                            <Input disabled placeholder="Auto-filled from transaction" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Phone number</label>
                            <Input disabled placeholder="Auto-filled" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Address</label>
                            <Input disabled placeholder="Auto-filled" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Financials</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Total contract value</label>
                        <Input placeholder="e.g., 3.2B VND" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Deposit amount</label>
                        <Input placeholder="e.g., 100M VND" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Paid</label>
                        <Input placeholder="e.g., 500M VND" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Remaining</label>
                        <Input disabled placeholder="Auto-calculated" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Payment terms</label>
                        <Textarea rows={3} placeholder="Enter payment terms..." />
                    </div>
                </CardContent>
            </Card>

            {/* Legal Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Legal & administration</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Sign date</label>
                        <Input type="date" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Effective date</label>
                        <Input type="date" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Expiry date (lease)</label>
                        <Input type="date" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Legal staff in charge (BM1)</label>
                        <Select onValueChange={setLegalStaffId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select legal staff..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NV001">NV001 - Attorney Nguyễn Văn A</SelectItem>
                                <SelectItem value="NV002">NV002 - Attorney Trần Thị B</SelectItem>
                                <SelectItem value="NV003">NV003 - Attorney Lê Văn C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="text-sm text-gray-600">Contract file</label>
                        <Input type="file" accept=".pdf,.doc,.docx" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600 mb-2 block">Contract status</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-draft" 
                                    checked={contractStatus === "draft"}
                                    onCheckedChange={(checked) => checked && setContractStatus("draft")}
                                />
                                <Label htmlFor="status-draft" className="text-sm font-normal">
                                    Draft
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-pending" 
                                    checked={contractStatus === "pending"}
                                    onCheckedChange={(checked) => checked && setContractStatus("pending")}
                                />
                                <Label htmlFor="status-pending" className="text-sm font-normal">
                                    Awaiting signature
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-signed" 
                                    checked={contractStatus === "signed"}
                                    onCheckedChange={(checked) => checked && setContractStatus("signed")}
                                />
                                <Label htmlFor="status-signed" className="text-sm font-normal">
                                    Signed
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-notarized" 
                                    checked={contractStatus === "notarized"}
                                    onCheckedChange={(checked) => checked && setContractStatus("notarized")}
                                />
                                <Label htmlFor="status-notarized" className="text-sm font-normal">
                                    Notarized
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-liquidated" 
                                    checked={contractStatus === "liquidated"}
                                    onCheckedChange={(checked) => checked && setContractStatus("liquidated")}
                                />
                                <Label htmlFor="status-liquidated" className="text-sm font-normal">
                                    Liquidated
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="status-cancelled" 
                                    checked={contractStatus === "cancelled"}
                                    onCheckedChange={(checked) => checked && setContractStatus("cancelled")}
                                />
                                <Label htmlFor="status-cancelled" className="text-sm font-normal">
                                    Cancelled
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex justify-center gap-3">
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
