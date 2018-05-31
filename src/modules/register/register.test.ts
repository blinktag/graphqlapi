import { request } from "graphql-request";

import { User } from "../../entity/User";
import { startServer } from "../../startServer";
import { duplicateEmail, emailNotLongEnough, passwordNotLongEnough } from "./errorMessages";

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = "tom@bob.com";
const password = "jalksdf";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("Register User", async () => {

  it("Registration succeeds", async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });

  it("Duplicate registration returns an error", async () => {
    const response: any = await request(getHost(), mutation(email, password));
    expect(response.register).toHaveLength(1);
    expect(response.register[0]).toEqual({
      path: "email",
      message: duplicateEmail
    });
  });

  it("Email not long enough", async () => {
    const response: any = await request(getHost(), mutation('a', password));
    expect(response.register).toHaveLength(2);
    expect(response.register[0]).toEqual({
      path: "email",
      message: emailNotLongEnough
    });
  });

  it("Password not long enough", async () => {
    const response: any = await request(getHost(), mutation(email, "b"));
    expect(response.register).toHaveLength(1);
    expect(response.register[0]).toEqual({
      path: "password",
      message: passwordNotLongEnough
    });
  });

});
