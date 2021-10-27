import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { CustomError } from "../error";

export const seedUser = async (totalUsers: number) => {
  try {
    const userRepository = getRepository(User);
    const salt = await bcrypt.genSalt(10);
    let users = [];
    for (let index = 0; index < 50; index++) {
      users[index] = new User();
      users[index].name = faker.name.firstName();
      users[index].birthDate = faker.date.past().toDateString();
      users[index].email = faker.internet.email(users[index].name);
      users[index].password = await bcrypt.hash(
        faker.random.alphaNumeric(10),
        salt
      );
    }
    await userRepository.save(users);
  } catch (error) {
    console.log(error);
    throw new CustomError(400, "Error trying to execute function");
  }
};
