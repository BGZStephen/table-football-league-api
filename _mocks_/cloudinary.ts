export = {
  uploader: {
    upload: jest.fn(),
    destroy: jest.fn(),
  },
  v2: {
    api: {
      resources: jest.fn(),
    }
  },
  config: jest.fn(),
}