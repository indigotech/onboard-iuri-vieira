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

  it("should make login and return the user with a token", async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    await getRepository(User).insert({
      name: "Name Test",
      email: data.email,
      password: hash,
      birthDate: "06-05-1999",
    });

    const user = await getRepository(User).findOne({ email: data.email });

    expect(user.name).to.eq("Name Test");
    expect(user.birthDate).to.eq("06-05-1999");
    expect(user.email).to.eq("test@mail.com");

    const response = await loginRequest(loginMutation, {
      data,
    });

    const token = jwt.sign({ username: data.email }, "supersecret", {
      expiresIn: 3600,
    });

    expect(response.body.data.login.user.name).to.eq("Name Test");
    expect(response.body.data.login.user.birthDate).to.eq("06-05-1999");
    expect(response.body.data.login.user.email).to.eq("test@mail.com");

    expect(response.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });

    expect(response.body.data.login.token).to.eq(token);
  });

  it("should return an email error", async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: hash,
      birthDate: "06-05-1999",
    });

    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    expect(user.name).to.eq("Name Test");
    expect(user.birthDate).to.eq("06-05-1999");
    expect(user.email).to.eq("test@mail.com");

    data = {
      email: "test_error@mail.com",
      password: "123456test",
      rememberMe: false,
    };
    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Incorrect email!");
  });

  it("should return an password error", async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: hash,
      birthDate: "06-05-1999",
    });

    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    expect(user.name).to.eq("Name Test");
    expect(user.birthDate).to.eq("06-05-1999");
    expect(user.email).to.eq("test@mail.com");

    data = {
      email: "test@mail.com",
      password: "123456test_error",
      rememberMe: false,
    };
    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Incorrect password!");
  });

  it("should return a token that expires in 7 days", async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: hash,
      birthDate: "06-05-1999",
    });

    const user = await getRepository(User).findOne({ email: "test@mail.com" });

    expect(user.name).to.eq("Name Test");
    expect(user.birthDate).to.eq("06-05-1999");
    expect(user.email).to.eq("test@mail.com");

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: "7d",
    });

    data = {
      email: "test@mail.com",
      password: "123456test_error",
      rememberMe: true,
    };
    const response = await loginRequest(loginMutation, {
      data,
    });

    expect(response.body.data.login.user.name).to.eq("Name Test");
    expect(response.body.data.login.user.birthDate).to.eq("06-05-1999");
    expect(response.body.data.login.user.email).to.eq("test@mail.com");

    expect(response.body.data.login.user).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });

    expect(response.body.data.login.token).to.eq(token);
  });
});
