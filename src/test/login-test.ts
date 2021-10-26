import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { loginRequest } from "./request-functions";
import { LoginInput } from "../typeDefs";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

const loginMutation = `mutation LoginMutation($data: LoginInput!) {
  login(data: $data) {
    user {
      id
      name
      email
      birthDate
    }
    token
  }
}`;

let data: LoginInput = {
  email: "test@mail.com",
  password: "123456test",
  rememberMe: false,
};

describe("login mutation", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    await getRepository(User).insert({
      name: "Name Test",
      email: data.email,
      password: hash,
      birthDate: "06-05-1999",
    });
  });

  it("should make login and return the user with a token", async () => {
    const user = await getRepository(User).findOne({ email: data.email });

    const response = await loginRequest(loginMutation, {
      data,
    });

    const token = jwt.sign({ username: data.email }, "supersecret", {
      expiresIn: 3600,
    });

    expect(response.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });

    expect(response.body.data.login.token).to.eq(token);
  });

  it("should return a token that expires in 7 days", async () => {
    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: "7d",
    });

    data.rememberMe = true;

    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });

    expect(response.body.data.login.token).to.eq(token);
  });

  it("should return a password error", async () => {
    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    data.password = "123456test_error";

    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Incorrect password!");
  });

  it("should return an email error", async () => {
    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    data.email = "test_error@mail.com";
    data.password = "123456test";

    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Incorrect email!");
  });
});
