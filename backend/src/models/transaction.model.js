class Transaction {
  constructor(data) {
    this.id = data.id;
    this.real_estate_id = data.real_estate_id;
    this.client_id = data.client_id;
    this.staff_id = data.staff_id;
    this.offer_price = data.offer_price;
    this.terms = data.terms;
    this.status = data.status;
    this.cancellation_reason = data.cancellation_reason;
  }

  toJSON() {
    return {
      id: this.id,
      real_estate_id: this.real_estate_id,
      client_id: this.client_id,
      staff_id: this.staff_id,
      offer_price: this.offer_price,
      terms: this.terms,
      status: this.status,
      cancellation_reason: this.cancellation_reason,
    };
  }
}

module.exports = Transaction;
