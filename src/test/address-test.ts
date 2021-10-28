import { expect } from "chai";
import { getRepository } from "typeorm";
import { Address } from "../entity/Address";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as faker from "faker";

describe("address entity", function () {
  afterEach(async () => {
    const db = getRepository(User);
    await db.delete({});
    const clear = await db.count();
    expect(clear).to.equal(0);

    const addressDb = getRepository(Address);
    await addressDb.delete({});
    const clearAddress = await addressDb.count();
    expect(clearAddress).to.equal(0);
  });

  it("should return the lenghtOf address entity", async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("123456teste", salt);

    let addresses = [];
    for (let index = 0; index < 2; index++) {
      addresses[index] = new Address();
      addresses[index].cep = faker.address.zipCode();
      addresses[index].street = faker.address.streetName();
      addresses[index].streetNumber = faker.address.streetAddress();
      addresses[index].city = faker.address.cityName();
      addresses[index].neighborhood = faker.lorem.words(1);
      addresses[index].complement = faker.lorem.words(3);
      addresses[index].state = faker.address.stateAbbr();
    }

    await getRepository(Address).save(addresses);

    await getRepository(User).insert({
      name: "Name Test",
      email: "test@mail.com",
      password: hash,
      birthDate: "06-05-1999",
      addresses,
    });

    expect(addresses).to.be.lengthOf(2);
  });
});
