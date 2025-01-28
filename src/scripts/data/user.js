import { db } from "../main.js";

export class User {
  constructor(firstName, lastName, email, password) {
    const findRes = User.find(email);
    console.log(findRes);

    // Validate if user exists
    if (findRes) throw new Error("Email already registered");

    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.examAttempts = [];
  }

  static add(user) {
    let users = db.get("users");
    if (users) {
      users.push(user);
      db.set("users", users);
    } else {
      users = [user];
      db.set("users", users);
    }
  }

  // Adds an exam attempt to the user in local storage
  static addExamAttempt(userEmail, examAttempt) {
    if (examAttempt.constructor.name !== "ExamAttempt")
      throw new Error("Can only push objects of type ExamAttempt to user");
    let users = db.get("users");
    const userIndex = users.findIndex((user) => user.email === userEmail);
    if (userIndex === -1) {
      throw new Error(`User with email ${userEmail} does not exist`);
    }
    users[userIndex].examAttempts.push(examAttempt);
    db.set("users", users);
  }

  static find(email) {
    const users = db.get("users");
    if (users) {
      let result = users.filter((user) => {
        return user.email === email;
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
    if (user && user.password === password) {
      localStorage["currentUser"] = user.email;
      return user.email;
    }
    return null;
  }
}
