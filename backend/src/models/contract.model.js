class Contract {
  constructor(data) {
    this.id = data.id;
    this.transactionId = data.transaction_id;

    this.type = data.type;

    this.partyA = data.party_a;
    this.partyB = data.party_b;

    this.totalValue = Number(data.total_value);
    this.depositAmount = Number(data.deposit_amount);

    this.paymentTerms = data.payment_terms;
    this.paidAmount = Number(data.paid_amount);

    this.remainingAmount = Number(data.remaining_amount);

    this.signedDate = data.signed_date;
    this.effectiveDate = data.effective_date;
    this.expirationDate = data.expiration_date;

    this.attachments = data.attachments;

    this.status = data.status;
    this.staffId = data.staff_id;

    this.cancellationReason = data.cancellation_reason;
  }

  toJSON() {
    return {
      id: this.id,
      transaction_id: this.transactionId,
      type: this.type,
      party_a: this.partyA,
      party_b: this.partyB,
      total_value: this.totalValue,
      deposit_amount: this.depositAmount,
      payment_terms: this.paymentTerms,
      paid_amount: this.paidAmount,
      remaining_amount: this.remainingAmount,
      signed_date: this.signedDate,
      effective_date: this.effectiveDate,
      expiration_date: this.expirationDate,
      attachments: this.attachments,
      status: this.status,
      staff_id: this.staffId,
      cancellation_reason: this.cancellationReason,
    };
  }
}
module.exports = Contract;
