import { User, IUserCreateParams, IUserAuthenticationParams } from "./user";

jest.mock('../../models/user', () => require('../../models/_mocks_/user'));

describe('User Domain Helpers', () => {
  describe('create', () => {
    test('user creation fails as firstName not supplied', async () => {
      const userProperties = {
        lastName: "Wright",
        email: "stephen@test.com",
        password: "boo"
      } as IUserCreateParams

      await expect(User.create(userProperties)).rejects.toThrowError("\"First name\" is required");
    });

    test('user creation fails as lastName not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        email: "stephen@test.com",
        password: "boo"
      } as IUserCreateParams

      await expect(User.create(userProperties)).rejects.toThrowError("\"Last name\" is required");
    });

    test('user creation fails as email not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        password: "boo"
      } as IUserCreateParams

      await expect(User.create(userProperties)).rejects.toThrowError("\"Email\" is required");
    });

    test('user creation fails as password not supplied', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
      } as IUserCreateParams

      await expect(User.create(userProperties)).rejects.toThrowError("\"Password\" is required");
    });

  
    test('user creation fails as password not strong enough', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "boo"
      } as IUserCreateParams

      await expect(User.create(userProperties)).rejects.toThrowError("Password is not strong enough");
    });

    test('user creation fails as user with the same email address already exists', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "Squall333!"
      } as IUserCreateParams

      require('../../models/user').UserModel.count.mockResolvedValue(true)

      await expect(User.create(userProperties)).rejects.toThrowError("Email address already in use");
    });

    test('user created successfully', async () => {
      const userProperties = {
        firstName: "Stephen",
        lastName: "Wright",
        email: "stephen@test.com",
        password: "Squall333!"
      } as IUserCreateParams

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

  describe('authenticate', () => {
    test('user authentication fails as no user found with matching email address', async () => {
      const userProperties = {
        email: "stephen@test.com",
        password: "boo"
      } as IUserAuthenticationParams

      require('../../models/user').UserModel.findOne.mockResolvedValue(null)

      await expect(User.authenticate(userProperties)).rejects.toThrowError("Incorrect email address or password");
    });

    test('user authentication fails as password is not valid', async () => {
      const userProperties = {
        email: "stephen@test.com",
        password: "boo"
      } as IUserAuthenticationParams

      require('../../models/user').UserModel.findOne.mockResolvedValue({
        isPasswordValid: jest.fn().mockReturnValue(false)
      })

      await expect(User.authenticate(userProperties)).rejects.toThrowError("Incorrect email address or password");
    });

    test('user authentication passes', async () => {
      const userProperties = {
        email: "stephen@test.com",
        password: "boo"
      } as IUserAuthenticationParams

      require('../../models/user').UserModel.findOne.mockResolvedValue({
        isPasswordValid: jest.fn().mockReturnValue(true)
      })

      await expect(User.authenticate(userProperties)).resolves.toBeInstanceOf(User);
    });
  });
});
