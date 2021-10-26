import { User } from "./entity/User";
import { getConnection, getRepository } from "typeorm";
import { CustomError } from "./error";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

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
    createUser: async (_: any, args: any, context) => {
      if (!context.token) {
        throw new CustomError(
          401,
          "Token not found!",
          "You don't have permission to access this"
        );
      }

      if (!jwt.verify(context.token, "supersecret")) {
        throw new CustomError(
          401,
          "Not authorized",
          "You don't have permission to access this"
        );
      }

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
    login: async (_: any, args: any) => {
      const { email, password, rememberMe } = args.data;

      const user = await getRepository(User).findOne({ email });

      if (!user) {
        throw new CustomError(
          400,
          "Incorrect email!",
          "The email inserted is incorrect"
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        const timeToExpire = rememberMe ? "7d" : 3600;
        const token = jwt.sign({ username: user.email }, "supersecret", {
          expiresIn: timeToExpire,
        });
        return { user, token };
      } else {
        throw new CustomError(
          400,
          "Incorrect password!",
          "The password inserted is incorrect"
        );
      }
    },
  },
};

export default resolvers;
