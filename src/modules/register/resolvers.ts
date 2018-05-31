import { ResolverMap } from "../../types/graphql-utils";
import * as bcrypt from "bcryptjs";
import { User } from "../../entity/User";

export const resolvers: ResolverMap = {
  Query: {
    dummy: () => "dumb graphql bugs",
  },

  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {

      // Check if a user already exists
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']}
      );

      if (userAlreadyExists) {
        return [{
          path: "email",
          message: "already exists"
        }];
      }

      const saltLength = 10;
      const hashedPassword = await bcrypt.hash(password, saltLength);
      const user = User.create({
        email,
        password: hashedPassword,
      });
      await user.save();
      return null;
    }
  }
}
