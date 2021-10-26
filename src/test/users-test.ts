import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { authenticatedDataRequest } from "./request-functions";
import * as jwt from "jsonwebtoken";
import { GetUsersInput } from "../typeDefs";
import { seedUser } from "../seed/users-seed";

const userQuery = `query Query($data: GetUsersInput) {
  users(data: $data) {
    users{
      id
      name
      email
      birthDate
    }
    totalUsers
    prevPages
    nextPages
  }
}`;

describe("users query", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  beforeEach(async () => {
    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: 3600,
    });
  });

  it("should return 10 users, 1 prevPages and 1 nextPages", async () => {
    await seedUser(30);

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUsersInput = {
      take: 10,
      skip: 10,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.data.users.users).to.have.lengthOf(10);
    expect(response.body.data.users.prevPages).to.eq(1);
    expect(response.body.data.users.nextPages).to.eq(1);
  });

  it("should return 10 users, 1 prevPages and 0 nextPages", async () => {
    await seedUser(20);

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUsersInput = {
      take: 10,
      skip: 10,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.data.users.users).to.have.lengthOf(10);
    expect(response.body.data.users.prevPages).to.eq(1);
    expect(response.body.data.users.nextPages).to.eq(0);
  });

  it("should return a error that the number of users required is invalid", async () => {
    await seedUser(15);

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUsersInput = {
      take: 0,
      skip: 0,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.errors[0].code).to.equal(404);
    expect(response.body.errors[0].message).to.equal(
      "The number of users required is invalid!"
    );
  });

  it("should return a page not found error", async () => {
    await seedUser(5);

    const token = jwt.sign({ username: "test@mail.com" }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUsersInput = {
      take: 0,
      skip: 10,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, token);

    expect(response.body.errors[0].code).to.equal(404);
    expect(response.body.errors[0].message).to.equal("Page not found!");
  });

  it("should return an token not found error", async () => {
    let data: GetUsersInput = {
      take: 1,
      skip: 0,
    };

    const response = await authenticatedDataRequest(userQuery, { data }, "");

    expect(response.body.errors[0].code).to.equal(401);
    expect(response.body.errors[0].message).to.equal("Token not found!");
  });
});
