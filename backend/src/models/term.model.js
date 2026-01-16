class Term {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.content = data.content;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      content: this.content
    }
  }
}

module.exports = Term