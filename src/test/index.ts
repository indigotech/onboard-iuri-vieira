import startServer from "../connect";
import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import * as request from "supertest";

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

describe("Hello query", function () {
  it("shoud return a Hello word string", async () => {
    const response = await request
      .post("/")
      .send({ query: "query { hello }" })
      .set("Accept", "application/json")
      .expect(200);

    expect(response.body.data.hello).to.equal("Hello world!");
  });
});

describe("createUser mutation", function () {
  it("should insert a user", (done) => {
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
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.data.createUser.id).to.exist;
        expect(res.body.data.createUser.name).to.equal("Name Test");
        expect(res.body.data.createUser.email).to.equal("test@mail.com");
        expect(res.body.data.createUser.birthDate).to.equal("06-05-1999");

        done();
      });
  });
});

describe("getUser query", function () {
  it("should return inserted user", (done) => {
    request(`http://localhost:${process.env.PORT}/graphql`)
      .post("/")
      .set("Accept", "application/json")
      .send({
        query: `query {
          getUser(email: "test@mail.com") {
            id
            name
            email
          }
        }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body.data.getUser.id).to.exist;
        expect(res.body.data.getUser.name).to.equal("Name Test");
        expect(res.body.data.getUser.email).to.equal("test@mail.com");

        done();
      });
  });
});

describe("Clear the database", function () {
  it("should return an empty database", async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });
});
