import startServer from "../connect";
import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import * as request from "supertest";

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
  const db = getRepository(User);
  await db.clear();
  const clear = await db.count();
  expect(clear).to.equal(0);
});

describe("Hello query", function () {
  it("shoud return a Hello word string", async () => {
    const response = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .send({ query: "query { hello }" })
      .set("Accept", "application/json")
      .expect(200);

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
    const response = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: createUserMutation,
      })
      .expect(200);

    expect(response.body.data.createUser.id).to.greaterThan(0);
    expect(response.body.data.createUser.name).to.equal("Name Test");
    expect(response.body.data.createUser.email).to.equal("test@mail.com");
    expect(response.body.data.createUser.birthDate).to.equal("06-05-1999");
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
    const responseCreateUser = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: createUserMutation,
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

    const userId = responseCreateUser.body.data.createUser.id;

    const responseGetUser = await request(
      `http://localhost:${process.env.PORT}/graphql`
    )
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: `query {
          getUser(id: ${userId}) {
            id
            name
            email
            birthDate
          }
        }`,
      })
      .expect(200);

    expect(responseGetUser.body.data.getUser.id).to.equal(
      responseCreateUser.body.data.createUser.id
    );
    expect(responseGetUser.body.data.getUser.name).to.equal(
      responseCreateUser.body.data.createUser.name
    );
    expect(responseGetUser.body.data.getUser.email).to.equal(
      responseCreateUser.body.data.createUser.email
    );
    expect(responseGetUser.body.data.getUser.birthDate).to.equal(
      responseCreateUser.body.data.createUser.birthDate
    );
  });
});
