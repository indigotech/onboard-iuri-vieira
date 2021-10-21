import startServer from "../connect";
import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import * as request from "supertest";
import { queryRequest } from "./request-functions";

const createUserMutation = `mutation {
  createUser(data: {name: "Name Test", email: "test@mail.com", password: "123456teste", birthDate: "06-05-1999"}){
    id
    name
    email
    birthDate
  }
}`;

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

describe("Hello query", function () {
  it("shoud return a Hello word string", async () => {
    const response = await queryRequest(
      `http://localhost:${process.env.PORT}/graphql`,
      "query { hello }"
    );

    expect(response.body.data.hello).to.equal("Hello world!");
  });
});

describe("createUser mutation", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  it("should insert a user", async () => {
    const response = await queryRequest(
      `http://localhost:${process.env.PORT}/graphql`,
      createUserMutation
    );

    const id = response.body.data.createUser.id;
    const user = await getRepository(User).findOne({ id });

    expect(response.body.data.createUser.id).to.eq(user.id);
    expect(response.body.data.createUser.name).to.eq(user.name);
    expect(response.body.data.createUser.birthDate).to.eq(user.birthDate);
    expect(response.body.data.createUser.email).to.eq(user.email);
  });
});

describe("getUser query", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  it("should return inserted user", async () => {
    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: "123456teste",
      birthDate: "06-05-1999",
    });
    const user = await getRepository(User).findOne({
      email: "test@mail.com",
    });
    const userId = user.id;

    const response = await queryRequest(
      `http://localhost:${process.env.PORT}/graphql`,
      `query {
        getUser(id: ${userId}) {
          id
          name
          email
          birthDate
        }
      }`
    );

    expect(response.body.data.getUser.id).to.eq(user.id);
    expect(response.body.data.getUser.name).to.eq(user.name);
    expect(response.body.data.getUser.birthDate).to.eq(user.birthDate);
    expect(response.body.data.getUser.email).to.eq(user.email);
  });
});
