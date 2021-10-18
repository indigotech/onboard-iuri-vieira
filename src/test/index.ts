import startServer from "../connect";
import { expect } from "chai";
import * as dotenv from "dotenv";

const request = require("supertest");

before(async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();
});

describe("First test", function () {
  it("should print something on terminal", function () {
    console.log("The tests are working!");
  });
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
