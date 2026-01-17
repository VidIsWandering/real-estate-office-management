/**
 * Contract Service - Xử lý logic nghiệp vụ
 */
const { CONTRACT_STATUS } = require('../config/constants');
const clientRepository = require('../repositories/client.repository');
const contractRepository = require('../repositories/contract.repository');
const termRepository = require('../repositories/term.repository');
const fileService = require('./file.service');
const realEstateService = require('./real-estate.service');

class ContractService {
  async create(data, user) {
    const total_value = Number(data.total_value) || 0;
    const deposit_amount = Number(data.deposit_amount) || 0;

    const terms = [];

    for (const termData of data.payment_terms) {
      const term = await termRepository.create(termData);
      terms.push(term.toJSON());
    }

    const termIds = terms.map((item) => item.id);

    const contract = {
      ...data,
      staff_id: user.staff_id,
      status: 'draft',
      paid_amount: deposit_amount,
      remaining_amount: total_value - deposit_amount,
      payment_terms: termIds,
    };

    const result = await contractRepository.create(contract);
    return result.toJSON();
  }

  async getAll(query) {
    const result = await contractRepository.findAll(query);
    return result;
  }

  async getById(id) {
    const contract = await contractRepository.findById(id);
    const party_a = await clientRepository.findById(contract.partyA);
    const party_b = await clientRepository.findById(contract.partyB);
    const payment_terms = [];
    for (const termId of contract.paymentTerms) {
      const term = await termRepository.findById(termId);
      payment_terms.push(term);
    }
    if (!contract) throw new Error('Contract not found');
    return { ...contract.toJSON(), payment_terms, party_a, party_b };
  }

  async update(id, updateData) {
    const existing = await contractRepository.findById(id);
    if (!existing) throw new Error('Contract not found');
    if (existing.status !== 'draft')
      throw new Error('Only draft contracts can be updated');

    // Nếu cập nhật giá trị, tính toán lại remaining_amount
    if (updateData.total_value || updateData.deposit_amount) {
      const total = updateData.total_value || existing.totalValue;
      const deposit = updateData.deposit_amount || existing.depositAmount;
      updateData.remaining_amount = total - deposit;
    }
    if (updateData.payment_terms !== undefined) {
      const terms = [];

      for (const termData of updateData.payment_terms) {
        console.log(termData);
        const term = await termRepository.update(termData.id, {
          name: termData.name,
          content: termData.content,
        });
        terms.push(term);
      }

      updateData.payment_terms = terms.map((item) => item.id);
    }
    const updated = await contractRepository.updateById(id, updateData);
    return updated.toJSON();
  }

  async updateStatus(id, statusData) {
    const CONTRACT_STATUS_FLOW = {
      draft: ['pending_signature', 'cancelled'],
      pending_signature: ['signed', 'cancelled'],
      signed: ['notarized'],
      notarized: ['finalized'],
      finalized: [],
      cancelled: [],
    };

    const { status: nextStatus, signed_date, cancellation_reason } = statusData;

    const contract = await contractRepository.findById(id);
    if (!contract) {
      throw new Error('Contract not found');
    }

    const currentStatus = contract.status;

    // 1. Validate transition
    const allowedNextStatuses = CONTRACT_STATUS_FLOW[currentStatus] || [];
    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new Error(
        `Invalid status transition: ${currentStatus} → ${nextStatus}`
      );
    }

    // 2. Validate dữ liệu theo từng trạng thái
    if (nextStatus === CONTRACT_STATUS.SIGNED && !signed_date) {
      throw new Error('signed_date is required when status is SIGNED');
    }

    if (nextStatus === CONTRACT_STATUS.CANCELLED && !cancellation_reason) {
      throw new Error(
        'cancellation_reason is required when cancelling contract'
      );
    }

    // 3. Chuẩn bị data update
    const updateData = {
      status: nextStatus,
    };

    if (nextStatus === CONTRACT_STATUS.SIGNED) {
      updateData.signed_date = signed_date;
    }

    if (nextStatus === CONTRACT_STATUS.CANCELLED) {
      updateData.cancellation_reason = cancellation_reason;
    }

    const updated = await contractRepository.updateById(id, updateData);
    return updated.toJSON();
  }
  async addAttachments(id, files) {
    const attachments = files
      ? (await fileService.createManyFiles(files)).items.map((item) => item.id)
      : null;
    console.log(attachments);
    const updated = await contractRepository.updateById(id, { attachments });
    return updated;
  }

  async getAttachments(id) {
    const contract = await contractRepository.findById(id);
    console.log(contract.attachments);
    const attachments = await fileService.getFilesByIds(contract.attachments);
    return { attachments };
  }
}

module.exports = new ContractService();
