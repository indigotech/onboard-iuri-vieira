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

  it("should return an invalid email error", async () => {
    request(`http://localhost:${process.env.PORT}/graphql`)
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: `mutation{
          createUser(data: {name: "Name Test", email: "test@mail.com", password: "123456teste", birthDate: "06-05-1999"}){
            id
            name
            email
            birthDate
          }
        }`,
      })
      .end((err, res) => {
        if (err) {
          return err;
        }

        expect(res.body.errors[0].extensions.exception.code).to.equal(400);
        expect(res.body.errors[0].message).to.equal("Invalid email!");
      });
  });

  it("should return an invalid password error", async () => {
    request(`http://localhost:${process.env.PORT}/graphql`)
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: `mutation{
          createUser(data: {name: "Name Test", email: "test1@mail.com", password: "12345c", birthDate: "06-05-1999"}){
            id
            name
            email
            birthDate
          }
        }`,
      })
      .end((err, res) => {
        if (err) {
          return err;
        }

        expect(res.body.errors[0].extensions.exception.code).to.equal(400);
        expect(res.body.errors[0].message).to.equal("Invalid password!");
      });
  });

  it("should insert a user", async () => {
    const response = await queryRequest(
      `http://localhost:${process.env.PORT}/graphql`,
      createUserMutation
    );

    const id = response.body.data.createUser.id;
    const user = await getRepository(User).findOne({ id });

    expect(response.body.data.createUser.name).to.eq("Name Test");
    expect(response.body.data.createUser.birthDate).to.eq("06-05-1999");
    expect(response.body.data.createUser.email).to.eq("test@mail.com");

    expect(response.body.data.createUser).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });
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

    expect(response.body.data.getUser.name).to.eq("Name Test");
    expect(response.body.data.getUser.birthDate).to.eq("06-05-1999");
    expect(response.body.data.getUser.email).to.eq("test@mail.com");

    expect(response.body.data.getUser).to.be.deep.eq({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
    });
  });
});
