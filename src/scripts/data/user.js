import { db } from "../main.js";

class User {
  constructor(firstName, lastName, email, password) {
    const findRes = User.find(email);
    if (findRes) throw new Error("User already exists");
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

  static add(user) {
    console.log(user);

    let users = db.get("users");
    if (users) {
      users.push(user);
      db.set("users", users);
    } else {
      users = [user];
      db.set("users", users);
    }
  }

  static find(email) {
    const users = db.get("users");
    if (users) {
      let result = users.filter((user) => {
        user.email === email;
      });
      if (!result.length) {
        return null;
      } else {
        return result[0];
      }
    }
    return null;
  }

  static auth(email, password) {
    const user = User.find(email);
    if (user.password === password) return user;
    return null;
  }
}

let u = new User("Ahmed", "Mohamed", "mohamed@email.com", "password");
// console.log(u);

// console.log(db.get("users"));

User.add(u);
