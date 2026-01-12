/**
 * RealEstate Model - Định nghĩa structure của bảng real_estate
 */

class RealEstate {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.type = data.type;
    this.transaction_type = data.transaction_type; // 'sale' | 'rent'
    this.location = data.location;
    this.price = data.price;
    this.area = data.area;
    this.description = data.description || null;
    this.direction = data.direction || null; // 'north' | 'south' | 'east' | ...
    this.media_files = data.media_files || []; // array of BIGINT ids
    this.owner_id = data.owner_id;
    this.legal_docs = data.legal_docs || []; // array of BIGINT ids
    this.staff_id = data.staff_id;
    this.status = data.status || 'created'; // 'created' | 'pending_legal_check' | ...
  }

  /**
   * Convert instance to JSON
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      transaction_type: this.transaction_type,
      location: this.location,
      price: this.price,
      area: this.area,
      description: this.description,
      direction: this.direction,
      media_files: this.media_files,
      owner_id: this.owner_id,
      legal_docs: this.legal_docs,
      staff_id: this.staff_id,
      status: this.status,
    };
  }
}

module.exports = RealEstate;
