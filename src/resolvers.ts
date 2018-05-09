import { ResolverMap } from "./types/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "./entity/User";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) => `Hello ${name || 'World'}`
  },
  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const saltLength = 10;
      const hashedPassword = await bcrypt.hash(password, saltLength);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();
      return true;
    }
  }
}
