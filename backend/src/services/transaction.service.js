const transactionRepository = require('../repositories/transaction.repository');
const { ApiError } = require('../utils/api-error');

class TransactionService {
  async getAll({ role, staff_id }) {
    if (role === 'agent') {
      return transactionRepository.findByStaffId(staff_id);
    }
    return transactionRepository.findAll();
  }

  async getById(id, { role, staff_id }) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) throw new ApiError(404, 'Transaction not found');

    if (role === 'agent' && transaction.staff_id !== staff_id) {
      throw new ApiError(403, 'Forbidden');
    }

    return transaction;
  }

  async create(data, user) {
    const transaction = await transactionRepository.create({
      ...data,
      staff_id: user.staff_id,
      status: 'negotiating',
    });
    
  }

  async update(id, data, user) {
    const transaction = await this.getById(id, user);

    if (transaction.status !== 'negotiating') {
      throw new ApiError(400, 'Only negotiating transactions can be updated');
    }

    let updated = transaction;

    if (data.offer_price !== undefined) {
      updated = await transactionRepository.updateOfferPrice(id, data.offer_price);
    }

    if (data.terms !== undefined) {
      updated = await transactionRepository.updateTerms(id, data.terms);
    }

    return updated;
  }

  async finalize(id, user) {
    const transaction = await this.getById(id, user);

    if (transaction.status !== 'negotiating') {
      throw new ApiError(400, 'Transaction is not negotiating');
    }

    return transactionRepository.updateStatus(id, 'pending');
  }

  async cancel(id, reason, user) {
    const transaction = await this.getById(id, user);

    if (transaction.status !== 'negotiating') {
      throw new ApiError(400, 'Only negotiating transactions can be cancelled');
    }

    return transactionRepository.updateStatus(id, 'cancelled', reason || null);
  }
}

module.exports = new TransactionService();
