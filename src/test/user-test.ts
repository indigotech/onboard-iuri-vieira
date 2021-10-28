import { expect } from "chai";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Address } from "../entity/Address";
import { authenticateRequest } from "./request-functions";
import * as jwt from "jsonwebtoken";
import { AddressInput, GetUserInput } from "../typeDefs";
import * as faker from "faker";
import * as bcrypt from "bcrypt";

const userQuery = `query Query($data: GetUserInput) {
  user(data: $data) {
    id
    name
    email
    birthDate
    addresses {
      cep
      street
      streetNumber
      state
      city
      neighborhood
      complement
    }
  }
}`;

let address = {
  cep: faker.address.zipCode(),
  street: faker.address.streetName(),
  streetNumber: faker.address.streetAddress(),
  city: faker.address.cityName(),
  neighborhood: faker.lorem.words(1),
  complement: faker.lorem.words(3),
  state: faker.address.stateAbbr(),
};

describe("user query", function () {
  afterEach(async () => {
    const addressDb = getRepository(Address);
    await addressDb.delete({});
    const clearAddress = await addressDb.count();
    expect(clearAddress).to.equal(0);

    const db = getRepository(User);
    await db.delete({});
    const clear = await db.count();
    expect(clear).to.equal(0);
  });

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("123456teste", salt);

    const addresses = new Address();
    const user = new User();

    addresses.cep = faker.address.zipCode();
    addresses.street = faker.address.streetName();
    addresses.streetNumber = faker.address.streetAddress();
    addresses.city = faker.address.cityName();
    addresses.neighborhood = faker.lorem.words(1);
    addresses.complement = faker.lorem.words(3);
    addresses.state = faker.address.stateAbbr();

    user.name = "Name Test";
    user.email = "test@mail.com";
    user.birthDate = "06-05-1999";
    user.password = hash;
    user.addresses = [addresses];

    await getConnection().manager.save(user);

    address = {
      cep: addresses.cep,
      street: addresses.street,
      streetNumber: addresses.streetNumber,
      city: addresses.city,
      neighborhood: addresses.neighborhood,
      complement: addresses.complement,
      state: addresses.state,
    };
  });

  it("should return an user", async () => {
    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const token = jwt.sign({ username: insertedUser.email }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUserInput = { id: insertedUser.id };

    const response = await authenticateRequest(userQuery, { data }, token);

    expect(response.body.data.user).to.be.deep.eq({
      id: insertedUser.id,
      name: insertedUser.name,
      email: insertedUser.email,
      birthDate: insertedUser.birthDate,
      addresses: [address],
    });
  });

  it("should return an invalid token error", async () => {
    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const id = insertedUser.id;

    let data: GetUserInput = {
      id,
    };

    const response = await authenticateRequest(userQuery, { data }, "");

    expect(response.body.errors[0].code).to.equal(401);
    expect(response.body.errors[0].message).to.equal("Token not found!");
  });

  it("should return an user not found error", async () => {
    const insertedUser = await getRepository(User).findOne({
      email: "test@mail.com",
    });

    const token = jwt.sign({ username: insertedUser.email }, "supersecret", {
      expiresIn: 3600,
    });

    let data: GetUserInput = {
      id: 0,
    };

    const response = await authenticateRequest(userQuery, { data }, token);

    expect(response.body.errors[0].code).to.equal(404);
    expect(response.body.errors[0].message).to.equal("User not found!");
  });
});
