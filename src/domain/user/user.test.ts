import { User } from "./user";

jest.mock('../../models/user', () => require('../../models/_mocks_/user'));

describe('User Domain Helpers', () => {
  describe('create', () => {
    test('user creation fails as firstName not supplied', async () => {
      const userProperties = {
        lastName: "Wright",
        email: "stephen@test.com",
        password: "boo"
      }

      await expect(User.create(userProperties)).rejects.toThrowError("\"First name\" is required");
    });

    test('user creation fails as lastName not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        email: "stephen@test.com",
        password: "boo"
      }

      await expect(User.create(userProperties)).rejects.toThrowError("\"Last name\" is required");
    });

    test('user creation fails as email not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        password: "boo"
      }

      await expect(User.create(userProperties)).rejects.toThrowError("\"Email\" is required");
    });

    test('user creation fails as password not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
      }

      await expect(User.create(userProperties)).rejects.toThrowError("\"Password\" is required");
    });

  
    test('user creation fails as password not strong enough', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "boo"
      }

      await expect(User.create(userProperties)).rejects.toThrowError("Password is not strong enough");
    });

    test('user creation fails as user with the same email address already exists', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "Squall333!"
      }

      require('../../models/user').UserModel.count.mockResolvedValue(true)

      await expect(User.create(userProperties)).rejects.toThrowError("Email address already in use");
    });

    test('user created successfully', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "Squall333!"
      }

      require('../../models/user').UserModel.count.mockResolvedValue(0)
      require('../../models/user').UserModel.create.mockResolvedValue({
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "HASHEDPASSWORD"
      })

      await expect(User.create(userProperties)).resolves.toBeInstanceOf(User);
    });
  });
});
