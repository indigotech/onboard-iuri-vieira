import { expect } from "chai";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { mutationRequest } from "./request-functions";
import { UserInput } from "../typeDefs";

const createUserMutation = `mutation CreateUserMutation($data: UserInput!) {
  createUser(data: $data) {
    id
    name
    email
    birthDate
  }
}`;

describe("createUser mutation", function () {
  let data: UserInput = {
    name: "Name Test",
    email: "test@mail.com",
    password: "123456teste",
    birthDate: "06-05-1999",
  };

  afterEach(async () => {
    const db = getRepository(User);
    await db.clear();
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  it("should insert a user", async () => {
    const response = await mutationRequest(createUserMutation, { data });

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

  it("should return that the email is already in use error", async () => {
    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: "123456teste",
      birthDate: "06-05-1999",
    });

    const response = await mutationRequest(createUserMutation, { data });

    expect(response.body.errors[0].code).to.equal(409);
    expect(response.body.errors[0].message).to.equal(
      "This email is already in use!"
    );
  });

  it("should return an invalid password error", async () => {
    data = {
      name: "Name Test",
      email: "test@mail.com",
      password: "12345c",
      birthDate: "06-05-1999",
    };

    const response = await mutationRequest(createUserMutation, { data });

    expect(response.body.errors[0].code).to.equal(400);
    expect(response.body.errors[0].message).to.equal("Invalid password!");
  });
});
