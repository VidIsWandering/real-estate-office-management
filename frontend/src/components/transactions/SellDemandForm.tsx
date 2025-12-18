"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export function SellDemandForm() {
    const [customerId, setCustomerId] = useState("");
    const [propertyId, setPropertyId] = useState("");

    return (
        <div className="space-y-8">

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Thông tin nhu cầu bán</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Mã nhu cầu bán</label>
                        <Input disabled placeholder="Tự sinh theo hệ thống" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Ngày bắt đầu</label>
                        <Input type="date" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Ngày hết hạn</label>
                        <Input type="date" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Giá bán</label>
                        <Input placeholder="VD: 3.2 tỷ" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phần trăm hoa hồng (%)</label>
                        <Input type="number" placeholder="VD: 2" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">


                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600">Mã khách hàng</label>
                        <Select onValueChange={setCustomerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn khách hàng..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="KH001">KH001 - John Wilson</SelectItem>
                                <SelectItem value="KH002">KH002 - Sarah Martinez</SelectItem>
                                <SelectItem value="KH003">KH003 - Lisa Anderson</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Họ tên</label>
                        <Input disabled value="Tự động điền" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <Input disabled value="Tự động điền" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Số điện thoại</label>
                        <Input disabled value="Tự động điền" />
                    </div>

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600">Địa chỉ</label>
                        <Input disabled value="Tự động điền" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Thông tin bất động sản</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="md:col-span-3">
                        <label className="text-sm text-gray-600">Mã bất động sản</label>
                        <Select onValueChange={setPropertyId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn bất động sản..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BDS001">BDS001 - Oak Street House</SelectItem>
                                <SelectItem value="BDS002">BDS002 - Maple Avenue Condo</SelectItem>
                                <SelectItem value="BDS003">BDS003 - Pine Road Villa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Tên bất động sản</label>
                        <Input disabled value="Tự động điền" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Loại bất động sản</label>
                        <Input disabled value="Tự động điền" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Vị trí bất động sản</label>
                        <Input disabled value="Tự động điền" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Đặc điểm kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <div>
                        <label className="text-sm text-gray-600">Chiều rộng khuôn viên</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Chiều dài khuôn viên</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Diện tích khuôn viên</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Hướng</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Chiều rộng xây dựng</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Chiều dài xây dựng</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Diện tích xây dựng</label>
                        <Input />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Số tầng</label>
                        <Input type="number" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phòng ngủ</label>
                        <Input type="number" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phòng tắm</label>
                        <Input type="number" />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Phòng khách</label>
                        <Input type="number" />
                    </div>

                    <div className="md:col-span-4">
                        <label className="text-sm text-gray-600">Ghi chú</label>
                        <Textarea rows={4} />
                    </div>
                    <div className="md:col-span-4 flex justify-center">
                        <Button className="bg-primary text-white px-6">
                            Save
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
