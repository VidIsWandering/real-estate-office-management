/**
 * Staff Model - Định nghĩa structure của staff
 */

class Staff {
  constructor(data) {
    this.id = data.id;
    this.account_id = data.account_id;
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.assigned_area = data.assigned_area;
    this.role = data.role;
    this.status = data.status;
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      account_id: this.account_id,
      full_name: this.full_name,
      email: this.email,
      phone_number: this.phone_number,
      address: this.address,
      assigned_area: this.assigned_area,
      role: this.role,
      status: this.status,
    };
  }
}

module.exports = Staff;
