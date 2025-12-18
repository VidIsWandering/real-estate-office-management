"use client";

import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TransactionsInfoFormProps {
  transactionId: string;
}

export function TransactionsInfoForm({
  transactionId,
}: TransactionsInfoFormProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhu cầu bán</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Mã nhu cầu bán</label>
            <Input disabled value="NDB-001" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Họ tên khách hàng</label>
            <Input disabled value="Nguyễn Văn A" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <Input disabled value="0909 123 456" />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-gray-600">Vị trí bất động sản</label>
            <Input disabled value="Quận 1, TP.HCM" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhu cầu mua</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Mã nhu cầu mua</label>
            <Input disabled value="NDM-002" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Họ tên khách hàng</label>
            <Input disabled value="Trần Thị B" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <Input disabled value="0988 654 321" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin giao dịch</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Ngày tạo giao dịch</label>
            <Input disabled value="2025-01-15" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Ngày hết hạn</label>
            <Input disabled value="2025-02-15" />
          </div>
          <div>
            <label className="text-sm text-gray-600">
              Phần trăm hoa hồng (%)
            </label>
            <Input disabled value="2" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Giá mua bán</label>
            <Input disabled value="3.500.000.000 VNĐ" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Đã cọc</label>
            <Input disabled value="300.000.000 VNĐ" />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-gray-600">QĐ6</label>
            <Textarea
              disabled
              rows={3}
              value="Theo đúng quy định QĐ6 của công ty."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
