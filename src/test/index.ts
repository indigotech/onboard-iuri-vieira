import startServer from "../connect";
import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import * as request from "supertest";
import { queryRequest } from "./request-functions";
import { UserInput } from "../typeDefs";

const createUserMutation = `mutation {
  createUser(data: {name: "Name Test", email: "test@mail.com", password: "123456teste", birthDate: "06-05-1999"}){
    id
    name
    email
    birthDate
  }
}`;

const data: UserInput = {
  name: "Name Test",
  email: "test@mail.com",
  password: "123456teste",
  birthDate: "06-05-1999",
};

const dataPasswordError: UserInput = {
  name: "Name Test",
  email: "test@mail.com",
  password: "12345c",
  birthDate: "06-05-1999",
};

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

  it("should return that the email is already in use error", async () => {
    const responseCreateUser = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: createUserMutation,
        variables: { data },
      })
      .expect(200);

    expect(responseCreateUser.body.data.createUser.id).to.greaterThan(0);
    expect(responseCreateUser.body.data.createUser.name).to.equal("Name Test");
    expect(responseCreateUser.body.data.createUser.email).to.equal(
      "test@mail.com"
    );
    expect(responseCreateUser.body.data.createUser.birthDate).to.equal(
      "06-05-1999"
    );

    const response = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: createUserMutation,
        variables: { data },
      })
      .expect(200);

    expect(response.body.errors[0].code).to.equal(409);
    expect(response.body.errors[0].message).to.equal(
      "This email is already in use!"
    );
  });

  it("should return an invalid password error", async () => {
    const response = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: createUserMutation,
        variables: {
          data: {
            name: "Name Test",
            email: "test@mail.com",
            password: "12345c",
            birthDate: "06-05-1999",
          },
        },
      });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Invalid password!");
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
