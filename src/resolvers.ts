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
        user.password = password;
        user.birthDate = birthDate;
        await getConnection().manager.save(user);

        console.log("Cadastrado um novo usuário com o id: " + user.id);

        // const user = { firstName, lastName, age };
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
