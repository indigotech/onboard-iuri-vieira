import { User } from "./entity/User";
import { getConnection } from "typeorm";

const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { name, email, password, birthDate } = args;
      try {
        const user = new User();
        user.name = name;
        user.email = email;
        user.birthDate = birthDate;

        if (password.length > 6) {
          var regExpNum = /\d/g;
          var regExpLet = /[a-zA-Z]/g;

          if (regExpNum.test(password) && regExpLet.test(password)) {
            user.password = password;
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
        return error;
      }
    },
  },
};

export default resolvers;
