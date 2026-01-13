class RealEstateStatusHistory {
  constructor({
    id,
    real_estate_id,
    old_status,
    new_status,
    reason,
    changed_by,
    changed_at
  }) {
    this.id = id;
    this.real_estate_id = real_estate_id;
    this.old_status = old_status;
    this.new_status = new_status;
    this.reason = reason;
    this.changed_by = changed_by;
    this.changed_at = changed_at;
  }

  toJSON() {
    return {
      id: this.id,
      real_estate_id: this.real_estate_id,
      old_status: this.old_status,
      new_status: this.new_status,
      reason: this.reason,
      changed_by: this.changed_by,
      changed_at: this.changed_at
    };
  }
}

module.exports = RealEstateStatusHistory;
