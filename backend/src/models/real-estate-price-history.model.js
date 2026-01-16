class RealEstatePriceHistory {
  constructor({ id, real_estate_id, price, changed_at, changed_by }) {
    this.id = id;
    this.real_estate_id = real_estate_id;
    this.price = price;
    this.changed_at = changed_at;
    this.changed_by = changed_by;
  }

  toJSON() {
    return {
      id: this.id,
      real_estate_id: this.real_estate_id,
      price: this.price,
      changed_at: this.changed_at,
      changed_by: this.changed_by,
    };
  }
}

module.exports = RealEstatePriceHistory;
