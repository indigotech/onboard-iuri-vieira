import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { queryRequest } from "./request-functions";

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
