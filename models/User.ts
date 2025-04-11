export class User {
  constructor({ id, name, email, password, token = null }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.token = token;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      token: this.token
    };
  }

  static fromJSON(json) {
    return new User(json);
  }
}
