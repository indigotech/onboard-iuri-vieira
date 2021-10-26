import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { queryRequest, authenticatedDataRequest } from "./request-functions";
import * as jwt from "jsonwebtoken";
import { GetUserInput } from "../typeDefs";

const userQuery = `query Query($data: GetUserInput) {
  user(data: $data) {
    id
    name
    email
    birthDate
  }
}`;

describe("user query", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  it("should return an user", async () => {
    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: "123456teste",
      birthDate: "06-05-1999",
    });

    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const token = jwt.sign({ username: insertedUser.email }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUserInput = { id: insertedUser.id };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.data.user.name).to.eq("Name Test");
    expect(response.body.data.user.birthDate).to.eq("06-05-1999");
    expect(response.body.data.user.email).to.eq("test@mail.com");

    expect(response.body.data.user).to.be.deep.eq({
      id: insertedUser.id,
      name: insertedUser.name,
      email: insertedUser.email,
      birthDate: insertedUser.birthDate,
    });
  });

  it("should return an invalid token error", async () => {
    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: "123456teste",
      birthDate: "06-05-1999",
    });

    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const id = insertedUser.id;

    let data: GetUserInput = {
      id,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, "");

    expect(response.body.errors[0].code).to.equal(401);
    expect(response.body.errors[0].message).to.equal("Token not found!");
  });

  it("should return an user not found error", async () => {
    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: "123456teste",
      birthDate: "06-05-1999",
    });

    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const token = jwt.sign({ username: insertedUser.email }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUserInput = {
      id: 0,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.errors[0].code).to.equal(404);
    expect(response.body.errors[0].message).to.equal("User not found!");
  });
});
