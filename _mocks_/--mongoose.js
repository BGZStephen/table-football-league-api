
// const mongoose = jest.genMockFromModule('mongoose');

class mongooseModel {
  constructor() {
    console.log('Mock model was called');
  }

  findOne = jest.fn();
  find = jest.fn();
}

export default class mongoose {
  constructor() {
    console.log('Mock SoundPlayer: constructor was called');
  }

  model(modelName) {
    return new mongooseModel(modelName)
  }
}