class Term {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.context = data.context;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      context: this.context
    }
  }
}