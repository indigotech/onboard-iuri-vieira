import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as faker from "faker";
import * as bcrypt from "bcrypt";
import { CustomError } from "../error";
import * as dotenv from "dotenv";
import startServer from "../connect";

export const seedUser = async () => {
  try {
    dotenv.config();
    await startServer();

    const userRepository = getRepository(User);
    const salt = await bcrypt.genSalt(10);
    let user = [];
    for (let index = 0; index < 50; index++) {
      user[index] = new User();
      user[index].name = faker.name.firstName();
      user[index].birthDate = faker.date.past().toDateString();
      user[index].email = faker.internet.email(user[index].name);
      user[index].password = await bcrypt.hash(
        faker.random.alphaNumeric(10),
        salt
      );
    }
    await userRepository.save(user);
  } catch (error) {
    console.log(error);
    throw new CustomError(400, "Error trying to execute function");
  }
};

seedUser();
