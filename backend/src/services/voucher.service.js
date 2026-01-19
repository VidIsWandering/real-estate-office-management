// src/services/voucher.service.js

const voucherRepository = require('../repositories/voucher.repository');
const { ApiError } = require('../utils/apiError');
const { generateVoucherNo, VOUCHER_TYPE } = require('../models/voucher.model');

class VoucherService {
  /**
   * Lấy danh sách vouchers
   */
  async getVouchers(filters) {
    const { items, total } = await voucherRepository.findAll(filters);

    // Transform items và lấy attachment files
    const transformedItems = await Promise.all(
      items.map(async (item) => {
        const attachments = item.attachments
          ? await voucherRepository.getAttachmentFiles(item.attachments)
          : [];

        return {
          id: item.id,
          voucherNo: generateVoucherNo(item.type, item.id, new Date(item.payment_time)),
          contract: {
            id: item.contract_id
          },
          type: item.type,
          party: item.party,
          paymentTime: item.payment_time,
          amount: parseFloat(item.amount),
          paymentMethod: item.payment_method,
          paymentDescription: item.payment_description,
          attachments,
          createdBy: {
            id: item.staff_id,
            fullName: item.staff_name
          },
          status: item.status
        };
      })
    );

    return {
      items: transformedItems,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        totalItems: total,
        totalPages: Math.ceil(total / (filters.limit || 20))
      }
    };
  }

  /**
   * Lấy chi tiết voucher
   */
  async getVoucherById(id) {
    const voucher = await voucherRepository.findById(id);

    if (!voucher) {
      throw new ApiError(404, 'Không tìm thấy phiếu thu/chi');
    }

    const attachments = voucher.attachments
      ? await voucherRepository.getAttachmentFiles(voucher.attachments)
      : [];

    return {
      id: voucher.id,
      voucherNo: generateVoucherNo(voucher.type, voucher.id, new Date(voucher.payment_time)),
      contract: {
        id: voucher.contract_id,
        contractNo: `HD-${new Date(voucher.payment_time).getFullYear()}-${String(voucher.contract_id).padStart(3, '0')}`,
        type: voucher.contract_type,
        totalValue: parseFloat(voucher.contract_total_value),
        paidAmount: parseFloat(voucher.contract_paid_amount),
        remainingAmount: parseFloat(voucher.contract_remaining_amount),
        status: voucher.contract_status,
        partyA: {
          id: voucher.party_a_id,
          fullName: voucher.party_a_name
        },
        partyB: {
          id: voucher.party_b_id,
          fullName: voucher.party_b_name
        }
      },
      type: voucher.type,
      party: voucher.party,
      paymentTime: voucher.payment_time,
      amount: parseFloat(voucher.amount),
      paymentMethod: voucher.payment_method,
      paymentDescription: voucher.payment_description,
      attachments,
      createdBy: {
        id: voucher.staff_id,
        fullName: voucher.staff_name,
        email: voucher.staff_email
      },
      status: voucher.status
    };
  }

  /**
   * Tạo voucher mới
   */
  async createVoucher(data, staffId) {
    // Validate contract exists
    const contract = await voucherRepository.checkContractExists(data.contractId);
    if (!contract) {
      throw new ApiError(400, 'Hợp đồng không tồn tại hoặc đã bị hủy');
    }

    // Validate amount
    if (data.amount <= 0) {
      throw new ApiError(400, 'Số tiền phải lớn hơn 0');
    }

    // Create voucher
    const voucher = await voucherRepository.create({
      ...data,
      staffId
    });

    return {
      id: voucher.id,
      voucherNo: generateVoucherNo(voucher.type, voucher.id, new Date(voucher.payment_time)),
      message: voucher.type === VOUCHER_TYPE.RECEIPT
        ? 'Tạo phiếu thu thành công'
        : 'Tạo phiếu chi thành công'
    };
  }

  /**
   * Cập nhật voucher
   */
  async updateVoucher(id, data) {
    // Check if voucher exists and is editable
    const existing = await voucherRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Không tìm thấy phiếu thu/chi');
    }

    if (existing.status !== 'created') {
      throw new ApiError(400, 'Không thể sửa phiếu đã được xác nhận');
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      throw new ApiError(400, 'Số tiền phải lớn hơn 0');
    }

    const updated = await voucherRepository.update(id, data);

    if (!updated) {
      throw new ApiError(400, 'Cập nhật thất bại');
    }

    return {
      id: updated.id,
      message: 'Cập nhật phiếu thành công'
    };
  }

  /**
   * Xóa voucher
   */
  async deleteVoucher(id) {
    // Check if voucher exists and is deletable
    const existing = await voucherRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Không tìm thấy phiếu thu/chi');
    }

    if (existing.status !== 'created') {
      throw new ApiError(400, 'Không thể xóa phiếu đã được xác nhận');
    }

    const deleted = await voucherRepository.delete(id);

    if (!deleted) {
      throw new ApiError(400, 'Xóa thất bại');
    }

    return {
      message: 'Xóa phiếu thành công'
    };
  }

  /**
   * Xác nhận voucher
   */
  async confirmVoucher(id) {
    // Check if voucher exists
    const existing = await voucherRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Không tìm thấy phiếu thu/chi');
    }

    if (existing.status !== 'created') {
      throw new ApiError(400, 'Phiếu đã được xác nhận trước đó');
    }

    const confirmed = await voucherRepository.confirm(id);

    if (!confirmed) {
      throw new ApiError(400, 'Xác nhận thất bại');
    }

    return {
      id: confirmed.id,
      status: confirmed.status,
      message: 'Xác nhận phiếu thành công'
    };
  }

  /**
   * Lấy thống kê vouchers
   */
  async getStats(filters) {
    const { summary, byMonth } = await voucherRepository.getStats(filters);

    return {
      totalReceipts: parseFloat(summary.total_receipts),
      totalPayments: parseFloat(summary.total_payments),
      netAmount: parseFloat(summary.total_receipts) - parseFloat(summary.total_payments),
      receiptCount: parseInt(summary.receipt_count),
      paymentCount: parseInt(summary.payment_count),
      confirmedCount: parseInt(summary.confirmed_count),
      pendingCount: parseInt(summary.pending_count),
      byMonth: byMonth.map((m) => ({
        month: m.month,
        receipts: parseFloat(m.receipts),
        payments: parseFloat(m.payments)
      }))
    };
  }

  /**
   * Lấy vouchers theo contract
   */
  async getVouchersByContract(contractId) {
    const { contract, vouchers, summary } = await voucherRepository.findByContractId(contractId);

    if (!contract) {
      throw new ApiError(404, 'Không tìm thấy hợp đồng');
    }

    return {
      contract: {
        id: contract.id,
        contractNo: `HD-${new Date().getFullYear()}-${String(contract.id).padStart(3, '0')}`,
        type: contract.type,
        totalValue: parseFloat(contract.total_value),
        paidAmount: parseFloat(contract.paid_amount),
        remainingAmount: parseFloat(contract.remaining_amount),
        status: contract.status
      },
      vouchers: vouchers.map((v) => ({
        id: v.id,
        voucherNo: generateVoucherNo(v.type, v.id, new Date(v.payment_time)),
        type: v.type,
        party: v.party,
        amount: parseFloat(v.amount),
        paymentTime: v.payment_time,
        paymentMethod: v.payment_method,
        status: v.status
      })),
      summary: {
        totalReceipts: parseFloat(summary.total_receipts),
        totalPayments: parseFloat(summary.total_payments),
        voucherCount: parseInt(summary.voucher_count)
      }
    };
  }

  /**
   * Upload attachments cho voucher
   */
  async addAttachments(id, fileIds) {
    const existing = await voucherRepository.findById(id);
    if (!existing) {
      throw new ApiError(404, 'Không tìm thấy phiếu thu/chi');
    }

    // Merge existing and new attachments
    const currentAttachments = existing.attachments || [];
    const mergedAttachments = [...new Set([...currentAttachments, ...fileIds])];

    const updated = await voucherRepository.updateAttachments(id, mergedAttachments);
    if (!updated) {
      throw new ApiError(400, 'Cập nhật attachments thất bại');
    }

    const files = await voucherRepository.getAttachmentFiles(fileIds);

    return {
      uploadedFiles: files.map((f) => ({
        id: f.id,
        url: f.url,
        name: f.name
      }))
    };
  }
}

module.exports = new VoucherService();