import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as faker from "faker";
import * as bcrypt from "bcrypt";
import startServer from "../connect";
import * as dotenv from "dotenv";

export const seedUser = async () => {
  dotenv.config({ path: `${__dirname}/../../test.env` });
  await startServer();

  const userRepository = await getRepository(User);
  const salt = await bcrypt.genSalt(10);

  for (let index = 0; index < 50; index++) {
    const user = new User();
    user.name = faker.name.firstName();
    user.birthDate = faker.date.past().toDateString();
    user.email = faker.internet.email(user.name);
    user.password = user.password = await bcrypt.hash(
      faker.random.alphaNumeric(10),
      salt
    );

    await userRepository.save(user);
  }
};
