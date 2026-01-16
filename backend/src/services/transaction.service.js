const { REAL_ESTATE_STATUS, APPOINTMENT_STATUS, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../config/constants');
const appointmentRepository = require('../repositories/appointment.repository');
const clientRepository = require('../repositories/client.repository');
const realEstateRepository = require('../repositories/real-estate.repository');
const termRepository = require('../repositories/term.repository');
const transactionRepository = require('../repositories/transaction.repository');
const realEstateService = require('./real-estate.service');

class TransactionService {
  async getAll(query, user) {

    if (user.position == "agent")
      query.staff_id = user.staff_id

    return transactionRepository.findAll(query)
  }

  async getById(id, { position, staff_id }) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (position === 'agent' && transaction.staff_id !== staff_id) {
      throw new Error('Forbidden');

    }

    const terms = []

    for (const termId of transaction.terms) {
      const term = await termRepository.findById(termId)

      terms.push(term)
    }

    const client = await clientRepository.findById(transaction.client_id)

    const realEstate = await realEstateRepository.findById(transaction.real_estate_id)


    return {
      transaction: { ...transaction, terms },
      client: client,
      real_estate: realEstate
    };
  }

  async create(data, user) {
    const realEstate = await realEstateRepository.findById(data.real_estate_id);
    if (!realEstate) throw new Error('Real estate not found');

    const client = await clientRepository.findById(data.client_id);
    if (!client) throw new Error('Client not found');

    const completedAppointment = await appointmentRepository.findAll({ client_id: client.id, real_estate_id: realEstate.id, status: APPOINTMENT_STATUS.COMPLETED })
    console.log(completedAppointment)

    if (realEstate.status != REAL_ESTATE_STATUS.LISTED)
      throw new Error('This real estate is currently not available for transaction');

    const terms = []

    for (const termData of data.terms) {
      const term = await termRepository.create(termData)
      terms.push(term.toJSON())
    }

    const termIds = terms.map(item => item.id)

    const transaction = await transactionRepository.create({
      ...data,
      terms: termIds,
      staff_id: user.staff_id,
    });

    const updatedStatusRealEstate = await realEstateRepository.updateStatus(realEstate.id, REAL_ESTATE_STATUS.NEGOTIATING)



    return {
      transaction: { ...transaction.toJSON(), terms: terms },
      real_estate: updatedStatusRealEstate.toJSON(),
      client: client.toJSON(),
    };
  }

  async update(id, data, user) {
    const transaction = await transactionRepository.findById(id)

    if (transaction.status !== 'negotiating') {
      throw new Error('Only negotiating transactions can be updated');
    }

    let updated = transaction;

    if (data.offer_price !== undefined) {
      updated = await transactionRepository.updateOfferPrice(
        id,
        data.offer_price
      );
    }

    if (data.terms !== undefined) {

      const terms = []

      for (const termData of data.terms) {
        const term = await termRepository.update(termData.id, { name: termData.name, content: termData.content })
        terms.push(term)
      }

      updated.terms = terms

    }

    return updated;
  }

  async finalize(id, user) {
    const transaction = await transactionRepository.findById(id);

    if (transaction.status != 'negotiating') {
      throw new Error('Transaction is not negotiating');
    }

    return transactionRepository.updateStatus(id, TRANSACTION_STATUS.PENDING_CONTRACT);
  }

  async cancel(id, reason, user) {
    const transaction = await transactionRepository.findById(id);

    if (transaction.status != 'negotiating') {
      throw new Error('Only negotiating transactions can be cancelled');
    }
    await realEstateService.updateStatus(transaction.real_estate_id, REAL_ESTATE_STATUS.LISTED, user, reason)
    return await transactionRepository.updateStatus(id, 'cancelled', reason || null);
  }
}

module.exports = new TransactionService();
