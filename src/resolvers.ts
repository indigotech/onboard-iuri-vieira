import { User } from "./entity/User";
import { getConnection, getRepository } from "typeorm";
import { CustomError } from "./error";
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
    getUser: async (parent, args, context, info) => {
      const { id } = args;
      const user = await getRepository(User).findOne({ id });

      if (!user) {
        throw new CustomError(404, "User not found");
      }

      return user;
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { name, email, password, birthDate } = args.data;

      const user = new User();
      user.name = name;
      user.birthDate = birthDate;

      const repository = getRepository(User);
      const searchForEmail = await repository.findOne({ email });

      if (searchForEmail) {
        throw new CustomError(
          409,
          "This email is already in use!",
          "Insert a new email"
        );
      } else {
        user.email = email;
      }

      if (password.length > 6) {
        var searchForNumberRegExp = /\d/g;
        var searchForLetterRegExp = /[a-zA-Z]/g;

        const passwordHasNumber = searchForNumberRegExp.test(password);
        const passwordHasLetter = searchForLetterRegExp.test(password);

        if (passwordHasNumber && passwordHasLetter) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        } else {
          throw new CustomError(
            400,
            "Invalid password!",
            "The password has to contain at least one letter and one number"
          );
        }
      } else {
        throw new CustomError(
          400,
          "Invalid password!",
          "The password has to contain at least 7 chacaracters"
        );
      }

      await getConnection().manager.save(user);
      return user;
    },
  },
};

export default resolvers;
