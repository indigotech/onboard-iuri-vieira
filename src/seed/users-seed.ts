import { getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Address } from "../entity/Address";
import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { CustomError } from "../error";

export const seedUser = async (totalUsers: number) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let users = [];
    for (let index = 0; index < (totalUsers ?? 50); index++) {
      const addresses = new Address();
      addresses.cep = faker.address.zipCode();
      addresses.street = faker.address.streetName();
      addresses.streetNumber = faker.address.streetAddress();
      addresses.city = faker.address.cityName();
      addresses.neighborhood = faker.lorem.words(1);
      addresses.complement = faker.lorem.words(3);
      addresses.state = faker.address.stateAbbr();

      users[index] = new User();
      users[index].name = faker.name.firstName();
      users[index].birthDate = faker.date.past().toDateString();
      users[index].email = faker.internet.email(users[index].name);
      users[index].password = await bcrypt.hash(
        faker.random.alphaNumeric(10),
        salt
      );
      users[index].addresses = [addresses];
    }
    await getConnection().manager.save(users);
  } catch (error) {
    console.log(error);
    throw new CustomError(400, "Error trying to execute function");
  }
};
