import { getRepository } from "typeorm";
import { Address } from "../entity/Address";
import * as faker from "faker";
import { CustomError } from "../error";

export const seedAddress = async (totalAddresses: number) => {
  try {
    const addressRepository = getRepository(Address);

    let addresses = [];
    for (let index = 0; index < (totalAddresses ?? 50); index++) {
      addresses[index] = new Address();
      addresses[index].cep = faker.address.zipCode.toString();
      addresses[index].street = faker.address.streetName.toString();
      addresses[index].streetNumber = faker.datatype.number.toString();
      addresses[index].city = faker.address.cityName.toString();
      addresses[index].neighborhood = faker.lorem.words(1);
      addresses[index].complement = faker.lorem.words(3);
      addresses[index].state = faker.address.stateAbbr.toString();
    }

    await addressRepository.save(addresses);
  } catch (error) {
    throw new CustomError(400, "Error trying to execute function");
  }
};
