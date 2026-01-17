class ClientNote {
  constructor(data) {
    this.id = data.id;
    this.client_id = data.client_id;
    this.staff_id = data.staff_id;
    this.content = data.content;
    this.created_at = data.created_at;
  }

  toJSON() {
    return {
      id: this.id,
      client_id: this.client_id,
      staff_id: this.staff_id,
      content: this.content,
      created_at: this.created_at,
    };
  }
}

module.exports = ClientNote;
