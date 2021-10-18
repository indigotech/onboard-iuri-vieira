import { User } from "./entity/User";
import { getConnection, getRepository } from "typeorm";
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
    getUser: async (parent, args, context, info) => {
      try {
        const { email } = args;
        const user = await getRepository(User)
          .createQueryBuilder("user")
          .where("user.email = :email", { email })
          .getOne();

        return user;
      } catch (error) {
        return error;
      }
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { name, email, password, birthDate } = args.data;
      try {
        const user = new User();
        user.name = name;
        user.email = email;
        user.birthDate = birthDate;

        if (password.length > 6) {
          var searchForNumberRegExp = /\d/g;
          var searchForLetterRegExp = /[a-zA-Z]/g;

          if (
            searchForNumberRegExp.test(password) &&
            searchForLetterRegExp.test(password)
          ) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
          } else {
            console.log(
              "Senha inválida! A senha precisa ter ao menos uma letra e um numero"
            );
          }
        } else {
          console.log(
            "Senha inválida! A senha precisa ter ao menos 7 caracteres"
          );
        }

        await getConnection().manager.save(user);
        return user;
      } catch (error) {
        console.log(
          "Erro ao tentar cadastrar o usuário, tente novamente mais tarde!"
        );
        console.log(error);
      }
    },
  },
};

export default resolvers;
