export = {
  UserModel: {
    findOne: jest.fn(function() {
      return this;
    }),
    count: jest.fn(),    
    create: jest.fn(function() {
      return this;
    })
  }
}