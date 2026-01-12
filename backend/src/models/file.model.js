class File {
  constructor(data) {
    this.id = data.id;
    this.url = data.url;
    this.name = data.name;
    this.type = data.type;
    this.uploaded_at = data.uploaded_at

  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      name: this.name,
      type: this.type,
      uploaded_at: this.uploaded_at
    }
  }
}

module.exports = File